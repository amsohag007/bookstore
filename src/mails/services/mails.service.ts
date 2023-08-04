import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { MailErrorHandler } from 'src/mails/handlers/mails-error.handler';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    emailTo: string,
    subject: string,
    template: string,
    context: object,
  ) {
    try {
      // console.log('sending mail to...', emailTo);
      const send = await this.mailerService.sendMail({
        to: emailTo,
        subject: subject,
        template: template,
        context: context,
      });
      return {
        status: 'success',
        message: ' Email sent successfully.',
      };
    } catch (error) {
      // console.log(error);
      MailErrorHandler(error);
    }
  }
}
