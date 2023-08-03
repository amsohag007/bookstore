import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseDTO } from 'src/core/dtos';

export class UserDTO extends BaseDTO {
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

  @ApiProperty({
    description: 'UserName ',
    type: String,
    required: true,
  })
  @IsDefined()
  @IsString()
  userName: string;

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

  // @ApiPropertyOptional({
  //   description: 'User password ',
  //   type: String,
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  @Exclude()
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

  constructor(partial: Partial<UserDTO>) {
    super();
    Object.assign(this, partial);
  }
}
