import { ApiProperty } from '@nestjs/swagger';
import { OrderItem, OrderStatusEnum } from '@prisma/client';
import { IsDefined, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from 'src/core/dtos';

export class OrderDTO extends BaseDTO {
  @ApiProperty({
    description: 'User id',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Order Status.',
    enum: OrderStatusEnum,
    required: true,
  })
  @IsDefined()
  @IsEnum(OrderStatusEnum)
  orderStatus: OrderStatusEnum;

  constructor(partial: Partial<OrderDTO>) {
    super();
    Object.assign(this, partial);
  }
}
