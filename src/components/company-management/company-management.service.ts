import {
  Injectable,
  Logger,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, RecruiterEntity } from '@entities';
import {
  ChangePasswordDto,
  CompleteRegistrationDto,
  InviteRecruiterDto,
  ResetPasswordDto,
  UpdateCompanyDto,
  UpdateRecruiterDto,
} from '@dtos';
import { RedisService } from 'src/core/cache/redis.service';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import CONFIG from '@config';
import { hashPassword, updateObjectFields, verifyPassword } from '@utils';
import { RecruiterRole } from '@enums';

@Injectable()
export class CompanyManagementService {
  private readonly loggerPrefix = '[AdminService]';

  constructor(
    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepository: Repository<RecruiterEntity>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly logger: Logger,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  public async inviteRecruiter(adminId: number, inviteDto: InviteRecruiterDto): Promise<void> {
    try {
      const existingRecruiter = await this.recruiterRepository.findOne({
        where: { email: inviteDto.email },
      });
      if (existingRecruiter) {
        throw new ConflictException(`Recruiter with email ${inviteDto.email} already exists`);
      }

      const admin = await this.recruiterRepository.findOne({
        where: { id: adminId },
        relations: ['company'],
      });

      if (!admin.company) {
        throw new NotFoundException('Admin does not belong to any company');
      }

      const inviteToken = uuidv4();
      const inviteKey = `recruiter_invite:${inviteToken}`;

      await this.redisService.set(
        inviteKey,
        JSON.stringify({
          ...inviteDto,
          companyId: admin.company.id,
        }),
        86400, // 24 hours (TTL)
      );

      const inviteLink = `${CONFIG.APP.FRONTEND_URL}/auth/complete-registration?token=${inviteToken}`;

      // await this.emailService.sendEmail(
      //   inviteDto.email,
      //   'Recruiter Invitation',
      //   `Hello ${inviteDto.firstName},\nYou've been invited to join ${admin.company.name}.\nClick here: ${inviteLink}`,
      // );

      this.logger.log(`${this.loggerPrefix} Invitation link for ${inviteDto.email}: ${inviteLink}`);
    } catch (error) {
      this.logger.error(
        `${this.loggerPrefix} Failed to send recruiter invitation: ${error.message}`,
      );
      throw error;
    }
  }

  public async completeRegistration(completeRegDto: CompleteRegistrationDto): Promise<void> {
    try {
      const inviteKey = `recruiter_invite:${completeRegDto.token}`;
      const inviteData = await this.redisService.get(inviteKey);

      if (!inviteData) {
        throw new UnauthorizedException('Invalid or expired invitation token');
      }

      const { email, firstName, lastName, companyId } = JSON.parse(inviteData);

      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const hashedPassword = await hashPassword(completeRegDto.password);

      const newRecruiter = this.recruiterRepository.create({
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        role: RecruiterRole.RECRUITER,
        company,
      });
      await this.recruiterRepository.save(newRecruiter);

      await this.redisService.del(inviteKey);

      this.logger.log(`${this.loggerPrefix} Recruiter registration completed for email: ${email}`);
    } catch (error) {
      this.logger.error(
        `${this.loggerPrefix} Failed to complete recruiter registration: ${error.message}`,
      );
      throw error;
    }
  }

  public async updateCompany(
    adminId: number,
    companyId: number,
    updateDto: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    const admin = await this.recruiterRepository.findOne({
      where: { id: adminId },
      relations: ['company'],
    });

    if (!admin.company || admin.company.id !== companyId) {
      throw new UnauthorizedException('Invalid company ID');
    }

    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (updateDto.name && updateDto.name !== company.name) {
      const conflict = await this.companyRepository.findOne({
        where: { name: updateDto.name },
      });
      if (conflict && conflict.id !== companyId) {
        throw new ConflictException(`Company with name "${updateDto.name}" already exists`);
      }
    }

    Object.assign(company, updateDto);

    const updatedCompany = await this.companyRepository.save(company);
    return updatedCompany;
  }

  public async removeRecruiter(adminId: number, recruiterId: number): Promise<void> {
    const admin = await this.recruiterRepository.findOne({
      where: { id: adminId },
      relations: ['company'],
    });

    const recruiter = await this.recruiterRepository.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });

    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    if (!recruiter.company || recruiter.company.id !== admin.company.id) {
      throw new UnauthorizedException('Invalid recruiter ID');
    }

    await this.recruiterRepository.remove(recruiter);

    this.logger.log(
      `${this.loggerPrefix} Recruiter (ID: ${recruiterId}) removed by admin (ID: ${adminId})`,
    );
  }

  public async updateRecruiter(
    adminId: number,
    recruiterId: number,
    updateDto: UpdateRecruiterDto,
  ): Promise<RecruiterEntity> {
    const admin = await this.recruiterRepository.findOne({
      where: { id: adminId },
      relations: ['company'],
    });

    const recruiter = await this.recruiterRepository.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    if (!recruiter.company || recruiter.company.id !== admin.company.id) {
      throw new UnauthorizedException('Invalid recruiter ID');
    }

    updateObjectFields(recruiter, updateDto);

    const updatedRecruiter = await this.recruiterRepository.save(recruiter);
    return updatedRecruiter;
  }

  public async changeMyPassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.recruiterRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await verifyPassword(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await hashPassword(dto.newPassword);
    await this.recruiterRepository.save(user);

    this.logger.log(`${this.loggerPrefix} User (ID: ${userId}) changed own password successfully.`);
  }

  public async resetRecruiterPassword(
    adminId: number,
    recruiterId: number,
    dto: ResetPasswordDto,
  ): Promise<void> {
    const admin = await this.recruiterRepository.findOne({
      where: { id: adminId },
      relations: ['company'],
    });

    const recruiter = await this.recruiterRepository.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    if (!recruiter.company || recruiter.company.id !== admin.company.id) {
      throw new UnauthorizedException('Recruiter does not belong to your company');
    }

    recruiter.passwordHash = await hashPassword(dto.newPassword);
    await this.recruiterRepository.save(recruiter);

    this.logger.log(
      `${this.loggerPrefix} Admin (ID: ${adminId}) reset password for Recruiter (ID: ${recruiterId}).`,
    );
  }
}
