import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as amqp from 'amqplib';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${
      req.originalUrl
    }`;

    // console.log('logMessage', logMessage);

    // Send the log message to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('logs');
    channel.sendToQueue('logs', Buffer.from(logMessage));

    await channel.close();
    await connection.close();

    next();
  }
}
