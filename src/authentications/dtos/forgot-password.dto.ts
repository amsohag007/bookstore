import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString
} from "class-validator";

export class ForgotPasswordDTO {
  @ApiProperty({
    type: String,
    description: "Provide user Email when reseting password using email",
    required: false
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    description: "Provide user phone when reseting password using phone no",
    required: false
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    type: String,
    description:
      "Type of method (EMAIL or PHONE) for requesting forgot password",
    required: false
  })
  @IsDefined()
  @IsString()
  @IsEnum(["EMAIL", "PHONE"])
  type: string;
}
