import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RefreshTokenDto } from '@dtos';
import { AuthGuard } from '@guards';
import { User } from '@decorators';
import { AuthService } from './auth.service';
import { RecruiterRole } from '@enums';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged in',
  })
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 201,
    description: 'Tokens refreshed successfully',
  })
  public refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged out',
  })
  public logout(@User('sub') userId: number, @User('role') role: RecruiterRole) {
    return this.authService.logout(userId, role);
  }
}
