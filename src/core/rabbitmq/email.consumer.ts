import { Injectable } from '@nestjs/common';
import { MailsService } from '@src/mails/services';
import * as amqp from 'amqplib';

@Injectable()
export class EmailConsumer {
  constructor(private readonly mailsService: MailsService) {}

  async startListening() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('sendMail');

    channel.consume('sendMail', async (message) => {
      if (message !== null) {
        const { userEmail, subject, templete, data } = JSON.parse(
          message.content.toString(),
        );

        const isEmailSent = await this.mailsService.sendEmail(
          userEmail,
          subject,
          templete,
          { userId: data.userId, verificationCode: data.verificationCode },
        );

        if (isEmailSent) {
          // console.log('Email sent --------------', isEmailSent);
          // Acknowledge the message as processed
          channel.ack(message);
        }
      }
    });
  }
}
