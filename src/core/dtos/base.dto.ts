import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldStatusEnum, Prisma } from '@prisma/client';
import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsObject,
  IsUUID,
} from 'class-validator';

export class BaseDTO {
  @ApiProperty({
    description: 'id of the record.',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Record Status.',
    enum: FieldStatusEnum,
    required: false,
  })
  @IsDefined()
  @IsEnum(FieldStatusEnum)
  status!: FieldStatusEnum;

  @ApiProperty({
    description: 'Extra details of the records can be put here.',
    type: JSON,
    required: false,
  })
  @IsDefined()
  @IsObject()
  metaData?: Prisma.JsonValue;

  @ApiPropertyOptional({
    description: 'user id by whom the record was created.',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsUUID()
  createdById!: string;

  @ApiPropertyOptional({
    description: 'user id by whom the record was updated.',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsUUID()
  updatedById?: string;

  @ApiPropertyOptional({
    description: 'time when the record was created.',
    type: Date,
    required: false,
  })
  @IsDefined()
  @IsDateString({ strict: true } as any)
  createdAt!: Date;

  @ApiPropertyOptional({
    description: 'time when the record was updated.',
    type: Date,
    required: false,
  })
  @IsDefined()
  @IsDateString({ strict: true } as any)
  updatedAt!: Date;
}
