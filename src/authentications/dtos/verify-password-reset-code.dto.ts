import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class VerifyPasswordResetCodeDTO {
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
    description: 'Provide user phone when reseting password using phone no',
    required: false,
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  code: string;
}
