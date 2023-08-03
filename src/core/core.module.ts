import { Global, Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { PrismaService } from './services/prisma.services';

@Global()
@Module({
  imports: [],
  controllers: [CoreController],
  providers: [CoreService, PrismaService],
  exports: [PrismaService],
})
export class CoreModule {}
