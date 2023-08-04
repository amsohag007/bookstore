import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMailDTO {
  @ApiProperty({
    description: 'Receiver Email',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  receiverEmail: string;

  @ApiProperty({
    description: 'Mailing Subject ',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Email templete for this mail',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsString()
  templete: string;

  @ApiPropertyOptional({
    description: 'Add email context in JSON format.',
    type: JSON,
    required: false,
  })
  @IsOptional()
  @IsObject()
  context?: Prisma.JsonValue;

  constructor(partial: Partial<CreateMailDTO>) {
    Object.assign(this, partial);
  }
}
