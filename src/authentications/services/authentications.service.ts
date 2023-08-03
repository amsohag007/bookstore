import { UserRoleEnum } from '@prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/core/services';
import { SignInDTO, SignupDTO } from '../dtos';
import { JwtPayload, Tokens } from '../types';
import { PrismaErrorHandler } from 'src/core/handlers/prisma-error.handler';
import { ApiResponseDTO } from 'src/core/dtos';
import { UserDTO } from 'src/users/dtos';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signupLocal(signupDTO: SignupDTO): Promise<Tokens> {
    const expiresAfter = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
    const expiresIn = new Date();

    if (expiresAfter.endsWith('d')) {
      const days = Number(expiresAfter.substring(0, expiresAfter.length - 1));
      expiresIn.setDate(expiresIn.getDate() + days);
    }

    console.log('password', signupDTO.password);
    signupDTO.password = await argon2.hash(signupDTO.password);

    console.log('hashedpassword', signupDTO.password);

    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          ...signupDTO,
        },
      });

      await this.prismaService.authRefreshToken.create({
        data: {
          userId: createdUser.id,
          expiresAt: expiresIn,
        },
      });

      const tokens = await this.getTokens(
        createdUser.id,
        createdUser.email,
        createdUser.role,
      );
      await this.updateRtHash(createdUser.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async signinLocal(signinDTO: SignInDTO): Promise<Tokens> {
    const filters = {
      email: signinDTO.email,
    };
    try {
      const user = await this.prismaService.user.findUnique({
        where: filters,
      });
      console.log('user', user);
      if (user?.status === 'INACTIVE')
        throw new ForbiddenException(
          'Access Denied. Your account is deactive.',
        );

      if (!user) throw new ForbiddenException('Access Denied');

      const isPasswordValid = await argon2.verify(
        user.password,
        signinDTO.password,
      );

      console.log('user', isPasswordValid, user.password, signinDTO.password);

      if (!isPasswordValid) throw new ForbiddenException('Access Denied.');

      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRtHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async logout(userId: string) {
    try {
      const userData = await this.prismaService.authRefreshToken.updateMany({
        where: {
          userId: userId,
          token: {
            not: null,
          },
        },
        data: {
          token: null,
        },
      });

      if (userData.count === 0) {
        throw new BadRequestException('User is already logged out');
      }
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    try {
      const refreshToken = await this.prismaService.authRefreshToken.findUnique(
        {
          where: {
            userId: user.id,
          },
        },
      );

      if (!refreshToken) throw new ForbiddenException('Access Denied');

      if (refreshToken.expiresAt < new Date())
        throw new ForbiddenException('Access Revoked');

      if (!user || !refreshToken.token)
        throw new ForbiddenException('Access Denied');

      const rtMatches = await argon2.verify(refreshToken.token, rt);
      if (!rtMatches) throw new ForbiddenException('Access Denied');

      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRtHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    try {
      const expiresAfter = this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRATION',
      );
      const expiresIn = new Date();

      if (expiresAfter.endsWith('d')) {
        const days = Number(expiresAfter.substring(0, expiresAfter.length - 1));
        expiresIn.setDate(expiresIn.getDate() + days);
      }

      const hash = await argon2.hash(rt);

      await this.prismaService.authRefreshToken.upsert({
        create: {
          token: hash,
          userId: userId,
        },
        update: {
          token: hash,
          expiresAt: expiresIn,
        },
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      // this.logger.error(
      //   'Calling updateRtHash()',
      //   error.stack,
      //   AuthenticationsService.name,
      // );
      console.log(error);
      PrismaErrorHandler(error);
    }
  }

  async getTokens(
    userId: string,
    email: string,
    role?: UserRoleEnum,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    try {
      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
        }),
      ]);

      return {
        accessToken: at,
        refreshToken: rt,
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async getCurrentUser(userId: string): Promise<ApiResponseDTO<UserDTO>> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      return {
        status: 'success',
        message: ' User has been retrieved.',
        data: new UserDTO(user),
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
}
