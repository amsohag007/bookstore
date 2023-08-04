import { Global, Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { PrismaService } from './services/prisma.services';
import { EmailProducer } from './rabbitmq/email.producer';

@Global()
@Module({
  imports: [],
  controllers: [CoreController],
  providers: [CoreService, PrismaService, EmailProducer],
  exports: [PrismaService, EmailProducer],
})
export class CoreModule {}
