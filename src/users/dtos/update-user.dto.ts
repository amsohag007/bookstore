import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({
    description: 'UserName ',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  userName: string;

  @ApiPropertyOptional({
    description: 'User firstName.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    description: 'User lastName.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User Date of birth.',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'User email ',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User email ',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'User password ',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is email verified',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified!: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is phone verified',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified!: boolean;

  @ApiPropertyOptional({
    description: 'Details  can be stored in this field',
    type: JSON,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metaData?: Prisma.JsonValue;

  constructor(partial: Partial<UpdateUserDTO>) {
    Object.assign(this, partial);
  }
}
