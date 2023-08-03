import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '@prisma/client';
import { IsDefined, IsEnum } from 'class-validator';

export class UpdateOrderStausDTO {
  @ApiProperty({
    description: 'Order Status.',
    enum: OrderStatusEnum,
    required: true,
  })
  @IsDefined()
  @IsEnum(OrderStatusEnum)
  orderStatus: OrderStatusEnum;

  constructor(partial: Partial<UpdateOrderStausDTO>) {
    Object.assign(this, partial);
  }
}
