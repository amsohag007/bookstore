import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryCriteriaDTO } from 'src/core/dtos';

export class OrderQueryDTO extends BaseQueryCriteriaDTO {
  @ApiPropertyOptional({
    description: 'User id',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsUUID()
  userId: string = undefined;
}
