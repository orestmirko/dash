import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePrescreenDto } from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { User } from '@decorators';
import { RecruiterService } from './recruiter.service';
import { RecruiterRole } from '@enums';

@ApiTags('Recruiter')
@Controller('recruiter')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Post('prescreens')
  @Roles(RecruiterRole.ADMIN, RecruiterRole.RECRUITER)
  @ApiOperation({ summary: 'Create prescreen link for candidate' })
  @ApiResponse({
    status: 201,
    description: 'Prescreen link created successfully',
  })
  public createPrescreen(
    @User('sub') recruiterId: number,
    @Body() createPrescreenDto: CreatePrescreenDto,
  ) {
    return this.recruiterService.createPrescreen(recruiterId, createPrescreenDto);
  }
}
