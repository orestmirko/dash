import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@guards';
import { User } from '@decorators';
import { CreateVacancyDto, UpdateVacancyDto, GetVacanciesDto } from '@dtos';
import { VacancyService } from './vacancy.service';

@ApiTags('Vacancies')
@Controller('vacancies')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a vacancy' })
  @ApiResponse({ status: 201, description: 'Vacancy created' })
  public createVacancy(@User('sub') recruiterId: number, @Body() dto: CreateVacancyDto) {
    return this.vacancyService.createVacancy(recruiterId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vacancies' })
  @ApiResponse({ status: 200, description: 'List of vacancies returned' })
  public getAllVacancies(
    @User('sub') recruiterId: number,
    @Query() query: GetVacanciesDto,
  ) {
    return this.vacancyService.getVacancies(recruiterId, query);
  }

  @Get(':vacancyId')
  @ApiOperation({ summary: 'Get vacancy details by ID' })
  @ApiResponse({ status: 200, description: 'Vacancy found' })
  public getVacancyById(
    @User('sub') recruiterId: number,
    @Param('vacancyId', ParseIntPipe) vacancyId: number,
  ) {
    return this.vacancyService.getVacancyById(recruiterId, vacancyId);
  }

  @Patch(':vacancyId')
  @ApiOperation({ summary: 'Update vacancy by ID' })
  @ApiResponse({ status: 200, description: 'Vacancy updated' })
  public updateVacancy(
    @User('sub') recruiterId: number,
    @Param('vacancyId', ParseIntPipe) vacancyId: number,
    @Body() dto: UpdateVacancyDto,
  ) {
    return this.vacancyService.updateVacancy(recruiterId, vacancyId, dto);
  }

  @Delete(':vacancyId')
  @ApiOperation({ summary: 'Delete vacancy by ID' })
  @ApiResponse({ status: 200, description: 'Vacancy deleted' })
  public deleteVacancy(
    @User('sub') recruiterId: number,
    @Param('vacancyId', ParseIntPipe) vacancyId: number,
  ) {
    return this.vacancyService.deleteVacancy(recruiterId, vacancyId);
  }
}
