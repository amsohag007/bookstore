import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDTO {
  @ApiProperty({
    description: 'Book title',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Book writter',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  writer: string;

  @ApiProperty({
    description: 'Book coverImage',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  coverImage: string;

  @ApiProperty({
    description: 'Book price',
    type: Number,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Book tags',
    type: String,
    isArray: true,
    required: true,
  })
  @IsDefined()
  @IsArray()
  tags: string[];

  @ApiPropertyOptional({
    description: 'Details/images link can be stored in this field',
    type: JSON,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metaData?: Prisma.JsonValue;

  constructor(partial: Partial<CreateBookDTO>) {
    Object.assign(this, partial);
  }
}
