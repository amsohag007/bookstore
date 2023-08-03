import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqProducer {
  async sendLogMessage(message: string) {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('logs');
    channel.sendToQueue('logs', Buffer.from(message));

    await channel.close();
    await connection.close();
  }
}
