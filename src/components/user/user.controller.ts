import {
  LoginDto,
  RefreshTokenDto,
  SendVerificationCodeDto,
  SignUpDto,
  TokensDto,
  VerifySignUpDto,
} from '@dtos';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '@providers';
import { Throttle } from '@decorators';
import { AuthGuard, Roles } from '@guards';
import { UserRole } from '@enums';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @Throttle(2, 60)
  @ApiOperation({ summary: 'Initiate sign up process (SignUp step 1)' })
  @ApiResponse({
    status: 201,
    description: 'Verification code sent',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests',
  })
  public signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.userService.signUp(signUpDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify phone and complete registration (SignUp step 2)' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: TokensDto,
  })
  public verifyAndCompleteSignUp(@Body() verifySignUpDto: VerifySignUpDto): Promise<TokensDto> {
    return this.userService.verifyAndCompleteSignUp(verifySignUpDto.phone, verifySignUpDto.code);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  public async logout(@Request() req): Promise<void> {
    await this.userService.logout(req.user.sub);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: TokensDto,
  })
  public async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    return this.userService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('send-code')
  @ApiOperation({ summary: 'Send verification code (Login step 1)' })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent',
  })
  public async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ): Promise<void> {
    await this.userService.sendVerificationCode(sendVerificationCodeDto.phone);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user (Login step 2)' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: TokensDto,
  })
  public async login(@Body() loginDto: LoginDto): Promise<TokensDto> {
    return this.userService.login(loginDto.phone, loginDto.code);
  }
}
