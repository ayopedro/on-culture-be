import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/sign-in-user.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@@/common/guard/auth.guard';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetRequestUser } from '@@/common/decorators/get-user.decorator';
import { ResetDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiResponseMeta({ message: 'Registration Successful' })
  register(@Body() body: CreateUserDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  @ApiResponseMeta({ message: 'Login Successful' })
  login(@Body() body: SigninUserDto) {
    return this.authService.loginUser(body);
  }

  @Patch('change-password')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiResponseMeta({ message: 'Password successfully changed' })
  changePassword(
    @Body() body: ChangePasswordDto,
    @GetRequestUser() user: User,
  ) {
    return this.authService.changePassword(body, user);
  }

  @Patch('reset-password')
  @ApiResponseMeta({ message: 'Password successfully reset' })
  resetPassword(@Body() body: ResetDto) {
    return this.authService.resetPassword(body);
  }
}
