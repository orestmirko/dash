import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyWithAdminDto, CreateFreelancerDto } from '@dtos';
import { OnboardingService } from '@providers';

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('company')
  @ApiOperation({ summary: 'Create company + admin in one step' })
  @ApiResponse({ status: 201, description: 'Company created, tokens returned' })
  public async createCompanyWithAdmin(@Body() dto: CreateCompanyWithAdminDto) {
    return this.onboardingService.createCompanyWithAdmin(dto);
  }

  @Post('freelancer')
  @ApiOperation({ summary: 'Register as a freelance recruiter' })
  @ApiResponse({ status: 201, description: 'Freelancer created, tokens returned' })
  public async registerFreelancer(@Body() dto: CreateFreelancerDto) {
    return this.onboardingService.registerFreelancer(dto);
  }
}
