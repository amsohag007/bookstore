import { Module } from '@nestjs/common';
import { OrderController } from './controllers';
import { OrderService } from './services';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
