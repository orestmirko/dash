import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  InviteRecruiterDto,
  CompleteRegistrationDto,
  UpdateCompanyDto,
  UpdateRecruiterDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { RecruiterRole } from '@enums';
import { User } from '@decorators';
import { CompanyManagementService } from './company-management.service';

@ApiTags('Company Management')
@Controller('company-management')
export class CompanyManagementController {
  constructor(private readonly companyManagementService: CompanyManagementService) {}

  @Patch('me/password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change my own password (requires currentPassword + newPassword)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  public changeMyPassword(@User('sub') userId: number, @Body() dto: ChangePasswordDto) {
    return this.companyManagementService.changeMyPassword(userId, dto);
  }

  @Patch('recruiters/:recruiterId/password')
  @UseGuards(AuthGuard)
  @Roles(RecruiterRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset recruiter password (admin-only, no current password needed)' })
  @ApiResponse({ status: 200, description: 'Recruiter password reset successfully' })
  public resetRecruiterPassword(
    @User('sub') adminId: number,
    @Param('recruiterId', ParseIntPipe) recruiterId: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.companyManagementService.resetRecruiterPassword(adminId, recruiterId, dto);
  }

  @Post('recruiters/invite')
  @UseGuards(AuthGuard)
  @Roles(RecruiterRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite new recruiter to the admin’s company (admin-only)' })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent successfully',
  })
  public inviteRecruiter(@User('sub') adminId: number, @Body() inviteDto: InviteRecruiterDto) {
    return this.companyManagementService.inviteRecruiter(adminId, inviteDto);
  }

  @Post('recruiters/complete-registration')
  @ApiOperation({ summary: 'Complete recruiter registration (using token from invite)' })
  @ApiResponse({
    status: 201,
    description: 'Registration completed successfully',
  })
  public completeRegistration(@Body() completeRegDto: CompleteRegistrationDto) {
    return this.companyManagementService.completeRegistration(completeRegDto);
  }

  @Patch(':companyId')
  @UseGuards(AuthGuard)
  @Roles(RecruiterRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company information (admin-only)' })
  @ApiResponse({
    status: 200,
    description: 'Company successfully updated',
  })
  public updateCompany(
    @User('sub') adminId: number,
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() updateDto: UpdateCompanyDto,
  ) {
    return this.companyManagementService.updateCompany(adminId, companyId, updateDto);
  }

  @Delete('recruiters/:recruiterId')
  @UseGuards(AuthGuard)
  @Roles(RecruiterRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a recruiter from the company (admin-only)' })
  @ApiResponse({
    status: 200,
    description: 'Recruiter removed successfully',
  })
  public removeRecruiter(
    @User('sub') adminId: number,
    @Param('recruiterId', ParseIntPipe) recruiterId: number,
  ) {
    return this.companyManagementService.removeRecruiter(adminId, recruiterId);
  }

  @Patch('recruiters/:recruiterId')
  @UseGuards(AuthGuard)
  @Roles(RecruiterRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update recruiter data (admin-only)' })
  @ApiResponse({
    status: 200,
    description: 'Recruiter updated successfully',
  })
  public updateRecruiter(
    @User('sub') adminId: number,
    @Param('recruiterId', ParseIntPipe) recruiterId: number,
    @Body() updateDto: UpdateRecruiterDto,
  ) {
    return this.companyManagementService.updateRecruiter(adminId, recruiterId, updateDto);
  }
}
