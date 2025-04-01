import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { PrescreenEntity, VacancyEntity } from '@entities';
import { CreatePrescreenDto } from '@dtos';
import { PrescreenExpirationPreset, PrescreenStatus } from '@enums';
import CONFIG from '@config';
import { EmailService } from '../email/email.service';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(PrescreenEntity)
    private readonly prescreenRepository: Repository<PrescreenEntity>,
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    private readonly emailService: EmailService,
    private readonly logger: Logger,
  ) {}

  private getExpirationDate(dto: CreatePrescreenDto): Date {
    if (dto.expirationDate) {
      return dto.expirationDate;
    }

    const now = dayjs();
    switch (dto.expirationPreset) {
      case PrescreenExpirationPreset.ONE_DAY:
        return now.add(1, 'day').toDate();
      case PrescreenExpirationPreset.THREE_DAYS:
        return now.add(3, 'days').toDate();
      case PrescreenExpirationPreset.SEVEN_DAYS:
        return now.add(7, 'days').toDate();
      case PrescreenExpirationPreset.FOURTEEN_DAYS:
        return now.add(14, 'days').toDate();
      default:
        return now.add(1, 'day').toDate();
    }
  }

  public async createPrescreen(
    recruiterId: number,
    createPrescreenDto: CreatePrescreenDto,
  ): Promise<string> {
    try {
      const vacancy = await this.vacancyRepository.findOne({
        where: { id: createPrescreenDto.vacancyId },
        relations: ['questionPools'],
      });

      if (!vacancy) {
        throw new NotFoundException('Vacancy not found');
      }

      if (!vacancy.questionPools?.length) {
        throw new BadRequestException('Vacancy has no question pools assigned');
      }

      const token = uuidv4();
      const expiresAt = this.getExpirationDate(createPrescreenDto);

      const prescreen = this.prescreenRepository.create({
        candidateEmail: createPrescreenDto.candidateEmail,
        candidateFirstName: createPrescreenDto.candidateFirstName,
        candidateLastName: createPrescreenDto.candidateLastName,
        token,
        expiresAt,
        status: PrescreenStatus.NOT_STARTED,
        recruiter: { id: recruiterId },
        vacancy: { id: vacancy.id },
      });

      await this.prescreenRepository.save(prescreen);

      const prescreenLink = `${CONFIG.APP.FRONTEND_URL}/prescreen/${token}`;
      
      await this.emailService.sendPrescreenInvitation(
        createPrescreenDto.candidateEmail,
        {
          candidateName: createPrescreenDto.candidateFirstName,
          vacancyTitle: vacancy.title,
          prescreenLink,
          expirationDate: expiresAt,
        }
      );

      this.logger.log(`Created prescreen link for candidate: ${prescreenLink}`);
      return prescreenLink;
    } catch (error) {
      this.logger.error(`Failed to create prescreen: ${error.message}`);
      throw error;
    }
  }
}
