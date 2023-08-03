import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDTO<T> {
  @ApiProperty({
    description: 'Status of the response',
    type: String,
    required: true,
  })
  status: string;

  @ApiProperty({
    description: 'Data of the response',
    type: String,
    required: true,
    isArray: true,
  })
  data: T | T[];

  @ApiProperty({
    description: 'Message of the response',
    type: String,
    required: true,
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Current page',
    type: String,
    required: false,
  })
  currentPage?: number;

  @ApiPropertyOptional({
    description: 'Current page',
    type: String,
    required: false,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'TotalPages page',
    type: String,
    required: false,
  })
  totalPages?: number;

  @ApiPropertyOptional({
    description: 'totalCount',
    type: String,
    required: false,
  })
  totalCount?: number;
}
