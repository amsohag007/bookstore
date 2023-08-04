import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    type: String,
    description: 'Provide user Email when reseting password using email',
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Provide user phone when reseting password using phone no',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string = null;

  @ApiProperty({
    type: String,
    description:
      'Type of method (EMAIL or PHONE) for requesting forgot password',
    required: false,
  })
  @IsDefined()
  @IsString()
  @IsEnum(['EMAIL', 'PHONE'])
  type: string = 'EMAIL';

  @ApiProperty({
    type: String,
    description: 'Set a new password for your account.',
    required: false,
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}
