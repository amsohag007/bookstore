import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const PrismaErrorHandler = (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `A new record cannot be created with this ${error.meta.target[0]} `,
        },
        HttpStatus.CONFLICT,
      );
    }

    if (error.code === 'P2003') {
      const errorMsg = `Foreign key constraint failed on the field:  ${error.meta.field_name} `;
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: errorMsg,
        },
        HttpStatus.CONFLICT,
      );
    }

    if (error.code === 'P2023') {
      const message = `Inconsistent column data: ${error.meta.message}`;
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: message,
        },
        HttpStatus.CONFLICT,
      );
    }

    if (error.code === 'P2025') {
      throw new HttpException(
        {
          error: `${error.meta.cause}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  throw error;
};
