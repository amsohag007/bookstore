import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatusEnum, Prisma } from '@prisma/client';
import {
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateOrderDTO {
  @ApiPropertyOptional({
    description: 'User id',
    type: String,
    required: false,
  })
  @IsOptional()
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

  @ApiPropertyOptional({
    description: 'Others info can be stored in this field',
    type: JSON,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metaData?: Prisma.JsonValue;

  constructor(partial: Partial<UpdateOrderDTO>) {
    Object.assign(this, partial);
  }
}
