import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryCriteriaDTO } from 'src/core/dtos';

export class BookQueryDTO extends BaseQueryCriteriaDTO {
  @ApiPropertyOptional({
    description: 'Book title',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  title: string = undefined;

  @ApiPropertyOptional({
    description: 'Book writter',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  writer: string = undefined;
}
