import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/sign-in-user.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';

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
}
