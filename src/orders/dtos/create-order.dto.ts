import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import { IsArray, IsDefined, IsObject, IsOptional } from 'class-validator';

export class CreateOrderDTO {
  @ApiProperty({
    description: 'Array of bookIds.',
    type: String,
    isArray: true,
    required: true,
  })
  @IsDefined()
  @IsArray()
  books: string[];

  @ApiPropertyOptional({
    description: 'Details/images link can be stored in this field',
    type: JSON,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metaData?: Prisma.JsonValue;

  constructor(partial: Partial<CreateOrderDTO>) {
    Object.assign(this, partial);
  }
}
