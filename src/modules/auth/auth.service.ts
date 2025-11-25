import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'prisma/prisma.service';
import { SignupDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    public config: ConfigService,

  ) { }


  async signup(dto: SignupDto) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: dto.roleId },
      });

      if (!role) throw new BadRequestException("Invalid role provided");

      const existingUser = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ForbiddenException("Email already exists");
      }

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
          roleId: dto.roleId,
          name: dto.name,
          phone: dto.phone,
        },
      });

      return {
        message: "User created successfully",
        status: "success",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          roleId: user.roleId,
          token: await this.generate_JWT(user.id, user.email),
        },
      };
    } catch (error: any) {
      throw new ForbiddenException("Email must be unique");
    }
  }

  async signin(dto: LoginDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!existingUser) {
      throw new ForbiddenException("Invalid email or password");
    }

    const matchPassword = await bcrypt.compare(dto.password, existingUser.password);
    if (!matchPassword) {
      throw new ForbiddenException("Invalid email or password");
    }

    return {
      message: "Login successful",
      status: "success",
      data: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        phone: existingUser.phone, 
        token: await this.generate_JWT(existingUser.id, existingUser.email),
      },
    };
  }

  async generate_JWT(
    userId: number,
    email: string
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email
    }
    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwt.sign(payload,
      {
        expiresIn: '340m',
        secret: secret,
      }
    );
    return {
      accessToken: token
    }
  }
}
