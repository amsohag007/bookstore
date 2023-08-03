import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDTO {
  @ApiProperty({
    description: 'User firstName.',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User lastName.',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'UserName.',
    type: String,
    required: false,
  })
  @IsDefined()
  @IsString()
  userName: string;

  @ApiProperty({
    type: String,
    description: 'User email address',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User phone number',
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  // @Matches(/^\+[1-9]\d{1,14}$/)
  phone?: string;

  @ApiProperty({ type: String, description: 'User password', required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
