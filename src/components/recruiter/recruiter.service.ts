import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PrescreenEntity } from '@entities';
import { CreatePrescreenDto } from '@dtos';
import { PrescreenStatus } from '@enums';
import CONFIG from '@config';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(PrescreenEntity)
    private readonly prescreenRepository: Repository<PrescreenEntity>,
    private readonly logger: Logger,
  ) {}

  public async createPrescreen(
    recruiterId: number,
    createPrescreenDto: CreatePrescreenDto,
  ): Promise<string> {
    try {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (createPrescreenDto.expirationHours || 24));

      const prescreen = this.prescreenRepository.create({
        ...createPrescreenDto,
        token,
        expiresAt,
        status: PrescreenStatus.NOT_STARTED,
        recruiter: { id: recruiterId },
      });

      await this.prescreenRepository.save(prescreen);

      const prescreenLink = `${CONFIG.APP.FRONTEND_URL}/prescreen/${token}`;
      this.logger.log(`Created prescreen link for candidate: ${prescreenLink}`);

      return prescreenLink;
    } catch (error) {
      this.logger.error(`Failed to create prescreen: ${error.message}`);
      throw error;
    }
  }
}
