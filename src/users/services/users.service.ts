import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.services';
import { ApiResponseDTO } from 'src/core/dtos';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  UpdateUserStatusDTO,
  UserQueryDTO,
} from '../dtos';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthenticationsService } from 'src/authentications/services';
import { PrismaErrorHandler } from 'src/core/handlers/prisma-error.handler';
import { NotDataFoundResponse } from 'src/core/constants';
import { UserRoleEnum } from '@prisma/client';
import { User } from '../entity';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
    private localAuthenticationsService: AuthenticationsService,
  ) {}

  //create new --------
  async create(
    userId: string,
    signupDTO: CreateUserDTO,
  ): Promise<ApiResponseDTO<User>> {
    const expiresAfter = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
    const expiresIn = new Date();

    if (expiresAfter.endsWith('d')) {
      const days = Number(expiresAfter.substring(0, expiresAfter.length - 1));
      expiresIn.setDate(expiresIn.getDate() + days);
    }

    signupDTO.password = await argon2.hash(signupDTO.password);

    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          ...signupDTO,
          createdById: userId,
        },
      });

      await this.prismaService.authRefreshToken.create({
        data: {
          userId: createdUser.id,
          expiresAt: expiresIn,
        },
      });

      const tokens = await this.localAuthenticationsService.getTokens(
        createdUser.id,
        createdUser.email,
      );
      await this.localAuthenticationsService.updateRtHash(
        createdUser.id,
        tokens.refreshToken,
      );

      return {
        status: 'success',
        data: createdUser,
        message: 'Users created successfully.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  // find all-------- can be filtered by criteria

  async findByCriteria(query: UserQueryDTO): Promise<ApiResponseDTO<User[]>> {
    const filters = {
      email: query.email,
      role: query.role ? query.role : 'USER',
      phone: query.phone,
      isEmailVerified: query.isEmailVerified,
      isPhoneVerified: query.isPhoneVerified,
    };

    try {
      const totalCount = await this.prismaService.user.count({
        where: filters,
      });
      const totalPages = Math.ceil(totalCount / query.pageSize);

      if (totalCount === 0) {
        return NotDataFoundResponse;
      }

      const users = await this.prismaService.user.findMany({
        orderBy: {
          createdAt: query.orderBy,
        },
        take: query.pageSize,
        skip: (query.pageIndex - 1) * query.pageSize,
        where: filters,
        include: {
          orders: true,
        },
      });

      return {
        status: 'success',
        message: ' Users have been retrieved.',
        data: users,
        currentPage: query.pageIndex,
        pageSize: query.pageSize,
        totalPages: totalPages,
        totalCount: totalCount,
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //find one ------
  async findOne(id: string): Promise<ApiResponseDTO<User>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
        include: {
          orders: true,
        },
      });

      if (user === null) {
        return NotDataFoundResponse;
      }
      return {
        status: 'success',
        data: user,
        message: ' User has been retrieved.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //update ----------
  async update(
    id: string,
    userId: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<ApiResponseDTO<User>> {
    try {
      const updatedUserData = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserDTO,
          updatedById: userId,
        },
      });
      return {
        status: 'success',
        data: updatedUserData,
        message: ' Users info has been updated.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  // user's password update ----------
  async updatePassword(
    id: string,
    userId: string,
    updateUserPasswordDTO: UpdatePasswordDTO,
  ): Promise<ApiResponseDTO<User>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user)
        throw new ForbiddenException('Access Denied,User doesnt exists');

      const isPasswordValid = await argon2.verify(
        user.password,
        updateUserPasswordDTO.oldPassword,
      );

      if (!isPasswordValid) throw new ForbiddenException('Access Denied');

      updateUserPasswordDTO.password = await argon2.hash(
        updateUserPasswordDTO.password,
      );

      const updatedUserData = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          password: updateUserPasswordDTO.password,
          updatedById: userId,
        },
      });
      return {
        status: 'success',
        message: ' Users password has been updated.',
        data: updatedUserData,
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //status update ----------
  async updateStatus(
    id: string,
    userId: string,
    updateUserStatusDTO: UpdateUserStatusDTO,
  ): Promise<ApiResponseDTO<User>> {
    try {
      const updatedUserData = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserStatusDTO,
          updatedById: userId,
        },
      });
      return {
        status: 'success',
        message: ' User status has been updated.',
        data: updatedUserData,
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  //remove
  async remove(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (user.role === UserRoleEnum.ADMIN) {
        throw new ForbiddenException(
          'Access Denied,Admin user can not be deleted',
        );
      }

      return await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
}
