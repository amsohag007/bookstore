import { HttpException, HttpStatus } from '@nestjs/common';

export const MailErrorHandler = (error: any) => {
  throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
};
