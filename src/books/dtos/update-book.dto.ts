import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBookDTO {
  @ApiProperty({
    description: 'Book title',
    type: String,
    required: true,
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
    required: true,
  })
  @IsDefined()
  @IsString()
  tags: string[];

  @ApiPropertyOptional({
    description: 'Others info can be stored in this field',
    type: JSON,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metaData?: Prisma.JsonValue;

  constructor(partial: Partial<UpdateBookDTO>) {
    Object.assign(this, partial);
  }
}
