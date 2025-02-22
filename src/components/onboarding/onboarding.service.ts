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
    const existingCompany = await this.companyRepo.findOne({ where: { name: dto.name } });
    if (existingCompany) {
      throw new ConflictException(`Company with name "${dto.name}" already exists`);
    }

    const existingRecruiter = await this.recruiterRepo.findOne({
      where: { email: dto.admin.email },
    });
    if (existingRecruiter) {
      throw new ConflictException(`Recruiter with email "${dto.admin.email}" already exists`);
    }

    let savedCompany: CompanyEntity;
    let savedAdmin: RecruiterEntity;

    await this.companyRepo.manager.transaction(async (manager) => {
      const company = manager.create(CompanyEntity, {
        name: dto.name,
        description: dto.description,
        website: dto.website,
        linkedinUrl: dto.linkedinUrl,
        logoUrl: dto.logoUrl,
        companySize: dto.companySize,
      });
      savedCompany = await manager.save(company);

      const hashedPassword = await hashPassword(dto.admin.password);
      const adminRecruiter = manager.create(RecruiterEntity, {
        email: dto.admin.email,
        firstName: dto.admin.firstName,
        lastName: dto.admin.lastName,
        passwordHash: hashedPassword,
        imageUrl: dto.admin.imageUrl,
        role: RecruiterRole.ADMIN,
        company: savedCompany,
      });
      savedAdmin = await manager.save(adminRecruiter);
    });

    // Відправляємо email про успішне створення компанії
    // await this.emailService.sendEmail(
    //   dto.admin.email,
    //   EMAIL_TEMPLATES.COMPANY_CREATION.SUBJECT,
    //   EMAIL_TEMPLATES.COMPANY_CREATION.BODY(
    //     savedCompany.name,
    //     dto.admin.firstName,
    //   ),
    // );

    const tokens = await this.authService.login({
      email: dto.admin.email,
      password: dto.admin.password,
    });

    return {
      company: savedCompany,
      tokens,
    };
  }

  public async registerFreelancer(dto: CreateFreelancerDto): Promise<{
    freelancer: RecruiterEntity;
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
      imageUrl: dto.imageUrl,
      role: RecruiterRole.FREELANCER,
      company: null,
    });
    const savedFreelancer = await this.recruiterRepo.save(freelancerEntity);

    // await this.emailService.sendEmail(
    //   dto.email,
    //   EMAIL_TEMPLATES.FREELANCER_REGISTRATION.SUBJECT,
    //   EMAIL_TEMPLATES.FREELANCER_REGISTRATION.BODY(dto.firstName),
    // );

    const tokens = await this.authService.login({
      email: dto.email,
      password: dto.password,
    });

    return {
      freelancer: savedFreelancer,
      tokens,
    };
  }
}
