import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";

export class EmailVerifyDTO {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  @MaxLength(6)
  code: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  token: string;
}
