import { PrismaService } from '@@/common/database/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { SigninUserDto } from './dto/sign-in-user.dto';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetDto } from './dto/reset-password.dto';
import { AppUtilities } from '@@/common/utilities';
import { SensitiveUserInfo } from '@@/common/constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async createUser({ email, password, firstName, lastName }: CreateUserDto) {
    const hash = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hash,
          firstName,
          lastName,
        },
      });

      return AppUtilities.removeSensitiveData(user, SensitiveUserInfo);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email address already exists');
      }

      throw error;
    }
  }

  async loginUser({ email, password }: SigninUserDto) {
    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      throw new NotFoundException('Invalid credentials. User not found');

    const matchedPW = await argon.verify(user.password, password);

    if (!matchedPW)
      throw new UnauthorizedException('Incorrect Email or Password');

    user = AppUtilities.removeSensitiveData(user, SensitiveUserInfo);

    const accessToken = await this.generateAccessToken(user.id, user.email);

    return { user, accessToken };
  }

  async changePassword(
    { currentPassword, newPassword }: ChangePasswordDto,
    { email }: User,
  ) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    const matchedPW = await argon.verify(user.password, currentPassword);

    if (!matchedPW)
      throw new ForbiddenException('Current Password is Incorrect');

    const hash = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { email },
      data: { password: hash },
    });

    return AppUtilities.removeSensitiveData(user, SensitiveUserInfo);
  }

  async resetPassword({ email, token, newPassword }: ResetDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(' User not found');
    }

    if (token === '12345abc') {
      const hash = await argon.hash(newPassword);

      await this.prisma.user.update({
        where: { email: user.email },
        data: { password: hash },
      });
    } else {
      throw new NotAcceptableException('Invalid token provided');
    }
  }

  async generateAccessToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const options = {
      expiresIn: '1h',
      secret,
    };

    return this.jwtService.signAsync(payload, options);
  }
}
