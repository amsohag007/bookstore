import { ApiProperty } from '@nestjs/swagger';

export class ApiExceptionResponseDTO {
  @ApiProperty({
    description: 'Status Code of the response',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message of the error response',
    type: String,
    required: true,
  })
  message: string;

  @ApiProperty({
    description: 'Error name of the error response',
    type: String,
    required: true,
  })
  error: string;
}
