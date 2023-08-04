import * as argon2 from 'argon2';
import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import moment from 'moment';
import { TokenValidityStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/core/services';
import { MailsService } from 'src/mails/services';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyPasswordResetCodeDTO,
} from '../dtos';
import { PrismaErrorHandler } from 'src/core/handlers/prisma-error.handler';
import { EmailProducer } from '@src/core/rabbitmq/email.producer';

@Injectable()
export class AuthPasswordsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailsService: MailsService,
    private readonly emailProducer: EmailProducer,
  ) {}
  async initiatePasswordVerification(forgotPasswordDTO: ForgotPasswordDTO) {
    try {
      let userData;

      if (forgotPasswordDTO.type === 'EMAIL') {
        userData = await this.prismaService.user.findUnique({
          where: {
            email: forgotPasswordDTO.email,
          },
        });
      } else {
        userData = await this.prismaService.user.findUnique({
          where: {
            phone: forgotPasswordDTO.phone,
          },
        });
      }
      // console.log("userData", userData);

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      // console.log("verificationCode", verificationCode);

      const verificationToken =
        await this.prismaService.authVerificationToken.upsert({
          create: {
            type: 'password',
            token: verificationCode,
            userId: userData.id,
          },
          update: {
            token: verificationCode,
            validityStatus: TokenValidityStatusEnum.PENDING,
          },
          where: {
            userVerificationType: {
              userId: userData.id,
              type: 'password',
            },
          },
        });

      // console.log("verificationToken", verificationToken);

      if (!verificationToken) {
        throw new BadRequestException('Verification Code generation failed.');
      }

      if (forgotPasswordDTO.type === 'EMAIL') {
        // Use the OrderProducer to send email request
        await this.emailProducer.sendEmailRequest(
          userData.email,
          'Welcome to BookStore. Kindly Reset Password',
          './password-reset',
          { userId: userData.id, verificationCode: verificationCode },
        );

        // const isEmailSent = await this.mailsService.sendEmail(
        //   userData.email,
        //   'Welcome to BookStore. Kindly Reset Password',
        //   './password-reset',
        //   { userId: userData.id, verificationCode: verificationCode },
        // );

        // if (isEmailSent) {
        //   return {
        //     status: 'success',
        //     message:
        //       'Email verification code for resetting password is sent successfully.',
        //   };
        // }

        return {
          status: 'success',
          message:
            'Email verification code for resetting password is sent successfully.',
        };
      }
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async verifyPasswordResetCode(
    verifyPasswordResetCodeDTO: VerifyPasswordResetCodeDTO,
  ) {
    try {
      let userData;

      if (verifyPasswordResetCodeDTO.type === 'EMAIL') {
        userData = await this.prismaService.user.findUnique({
          where: {
            email: verifyPasswordResetCodeDTO.email,
          },
          include: {
            authVerificationToken: {
              where: {
                type: 'password',
              },
            },
          },
        });
      } else {
        userData = await this.prismaService.user.findUnique({
          where: {
            phone: verifyPasswordResetCodeDTO.phone,
          },
          include: {
            authVerificationToken: {
              where: {
                type: 'password',
              },
            },
          },
        });
      }
      // check token validity
      const currentTime = moment();
      // Get the "updatedAt" time from your userData object
      const updatedAt = moment(userData.authVerificationToken[0].updatedAt);
      // Calculate the difference in minutes between the current time and updatedAt
      const diffInMinutes = currentTime.diff(updatedAt, 'minutes');
      // console.log(diffInMinutes);

      if (diffInMinutes > 5) {
        throw new BadRequestException(
          'Verification code has been experied.Please request for a new one.',
        );
      }

      // check if verification code exists
      if (userData?.authVerificationToken[0]?.token === undefined) {
        throw new BadRequestException(
          "You don't have any verification code yet. Request for verification code before proceeding.",
        );
      }

      // compare provided token with stored token
      if (
        userData.authVerificationToken[0]?.token !==
        verifyPasswordResetCodeDTO.code
      ) {
        throw new BadRequestException('Wrong verification code provided');
      }

      // check if verification code exists
      if (
        userData?.authVerificationToken[0]?.validityStatus ===
        TokenValidityStatusEnum.VERIFIED
      ) {
        throw new BadRequestException('Token is already varified.');
      }

      await this.prismaService.authVerificationToken.update({
        where: {
          id: userData.authVerificationToken[0].id,
        },
        data: {
          validityStatus: TokenValidityStatusEnum.VERIFIED,
        },
      });

      return {
        status: 'success',
        message: 'Password reset token is validate successfully.',
      };
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }

  async updatePassword(resetPasswordDTO: ResetPasswordDTO) {
    try {
      resetPasswordDTO.password = await argon2.hash(resetPasswordDTO.password);

      let userData;

      if (resetPasswordDTO.type === 'EMAIL') {
        userData = await this.prismaService.user.findUnique({
          where: {
            email: resetPasswordDTO.email,
          },
          include: {
            authVerificationToken: {
              where: {
                type: 'password',
              },
            },
          },
        });
      } else {
        userData = await this.prismaService.user.findUnique({
          where: {
            phone: resetPasswordDTO.phone,
          },
          include: {
            authVerificationToken: {
              where: {
                type: 'password',
              },
            },
          },
        });
      }

      // compare provided token with stored token
      if (
        userData?.authVerificationToken[0]?.validityStatus === undefined ||
        userData.authVerificationToken[0]?.validityStatus !==
          TokenValidityStatusEnum.VERIFIED
      ) {
        throw new BadRequestException(
          "You haven't completed token verification yet. Please verify token before reseting password",
        );
      }

      const passwordUpdated = await this.prismaService.user.update({
        where: {
          email: resetPasswordDTO.email,
        },
        data: {
          password: resetPasswordDTO.password,
        },
      });

      // delete verification token after updating password
      await this.prismaService.authVerificationToken.delete({
        where: {
          id: userData.authVerificationToken[0].id,
        },
      });

      if (passwordUpdated) {
        return {
          status: 'success',
          message: 'Password has been reset successfully.',
        };
      } else {
        throw new BadRequestException('Password reset failed.');
      }
    } catch (error) {
      PrismaErrorHandler(error);
    }
  }
}
