import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity, RecruiterEntity } from '@entities';
import { CreateCompanyWithAdminDto, CreateFreelancerDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { hashPassword } from '@utils';
import { AuthService } from '@providers';
import { EmailService } from '../email/email.service';
import { EMAIL_TEMPLATES } from '@constants';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,

    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepo: Repository<RecruiterEntity>,

    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  public async createCompanyWithAdmin(dto: CreateCompanyWithAdminDto): Promise<{
    company: CompanyEntity;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const { admin: adminData, ...companyData } = dto;

    const existingCompany = await this.companyRepo.findOne({ 
      where: { 
        name: companyData.name,
        isVerified: true 
      } 
    });
    
    if (existingCompany) {
      throw new ConflictException(`Verified company with name "${companyData.name}" already exists`);
    }

    const existingRecruiter = await this.recruiterRepo.findOne({
      where: { email: adminData.email },
    });
    if (existingRecruiter) {
      throw new ConflictException(`Recruiter with email "${adminData.email}" already exists`);
    }

    let savedCompany: CompanyEntity;
    let savedAdmin: RecruiterEntity;

    try {
      await this.companyRepo.manager.transaction(async (manager) => {
        const company = manager.create(CompanyEntity, companyData);
        savedCompany = await manager.save(company);

        const hashedPassword = await hashPassword(adminData.password);
        const adminRecruiter = manager.create(RecruiterEntity, {
          ...adminData,
          passwordHash: hashedPassword,
          role: RecruiterRole.ADMIN,
          company: savedCompany,
        });
        savedAdmin = await manager.save(adminRecruiter);
      });
    } catch (error) {
      throw new ConflictException('Failed to create company and admin: ' + error.message);
    }

    // TODO: Uncomment after adding new email provider
    // await this.emailService.sendEmail({
    //   email: adminData.email,
    //   subject: EMAIL_TEMPLATES.COMPANY_CREATION.SUBJECT,
    //   message: EMAIL_TEMPLATES.COMPANY_CREATION.BODY(
    //     savedCompany.name,
    //     adminData.firstName,
    //   ),
    // });

    const tokens = await this.authService.login({
      email: adminData.email,
      password: adminData.password,
    });

    return {
      company: savedCompany,
      tokens,
    };
  }

  public async registerFreelancer(dto: CreateFreelancerDto): Promise<{
    freelancer: Omit<RecruiterEntity, 'passwordHash'>;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const existingRecruiter = await this.recruiterRepo.findOne({ where: { email: dto.email } });
    if (existingRecruiter) {
      throw new ConflictException(`Recruiter with email "${dto.email}" already exists`);
    }

    const hashedPassword = await hashPassword(dto.password);
    const freelancerEntity = this.recruiterRepo.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: hashedPassword,
      avatarUrl: dto.avatarUrl,
      role: RecruiterRole.FREELANCER,
      company: null,
    });
    const savedFreelancer = await this.recruiterRepo.save(freelancerEntity);

    const { passwordHash, ...freelancerResponse } = savedFreelancer;

    // TODO: Uncomment after adding new email provider
    // await this.emailService.sendEmail({
    //   email: dto.email,
    //   subject: EMAIL_TEMPLATES.FREELANCER_REGISTRATION.SUBJECT,
    //   message: EMAIL_TEMPLATES.FREELANCER_REGISTRATION.BODY(dto.firstName),
    // });

    const tokens = await this.authService.login({
      email: dto.email,
      password: dto.password,
    });

    return {
      freelancer: freelancerResponse,
      tokens,
    };
  }
}
