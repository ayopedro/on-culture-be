import { PrismaService } from '@@/common/database/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { SigninUserDto } from './dto/sign-in-user.dto';

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
      delete user.password;

      return { message: 'Registration Successful', user };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email address already exists');
      }

      throw error;
    }
  }

  async loginUser({ email, password }: SigninUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      throw new ForbiddenException('Invalid credentials. User not found');

    const matchedPW = await argon.verify(user.password, password);

    if (!matchedPW)
      throw new UnauthorizedException('Incorrect Email or Password');

    delete user.password;

    const accessToken = await this.generateAccessToken(user.id, user.email);

    return { user, accessToken };
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
