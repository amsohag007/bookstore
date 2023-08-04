import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class EmailProducer {
  async sendEmailRequest(
    userEmail: string,
    subject: string,
    templete: string,
    data: object,
  ) {
    // Send the log message to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('sendMail');
    const message = JSON.stringify({ userEmail, subject, templete, data });
    channel.sendToQueue('sendMail', Buffer.from(message));

    await channel.close();
    await connection.close();
  }
}
