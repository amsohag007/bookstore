import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FieldStatusEnum } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class BaseQueryCriteriaDTO {
  @ApiPropertyOptional({
    description: 'id of the record.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id: string = undefined;

  @ApiPropertyOptional({
    description: 'Index Of Page / Page Number.',
    type: Number,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageIndex?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of record per page.',
    type: Number,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: 'Name of the orderBy field.',
    type: String,
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sorting order of the field.',
    enum: Prisma.SortOrder,
    default: Prisma.SortOrder.desc,
    required: false,
  })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  orderBy?: Prisma.SortOrder = Prisma.SortOrder.desc;

  @ApiPropertyOptional({
    description: 'Record Status.',
    enum: FieldStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(FieldStatusEnum)
  status?: FieldStatusEnum = FieldStatusEnum.ACTIVE;

  @ApiPropertyOptional({
    description: 'user id by whom the record was created.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  createdById: string = undefined;

  @ApiPropertyOptional({
    description: 'user id by whom the record was updated.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  updatedById: string = undefined;

  @ApiPropertyOptional({
    description: 'time when the record was created.',
    type: Date,
    required: false,
  })
  @IsOptional()
  createdAt: Date = undefined;

  @ApiPropertyOptional({
    description: 'time when the record was updated.',
    type: Date,
    required: false,
  })
  @IsOptional()
  updatedAt: Date = undefined;
}
