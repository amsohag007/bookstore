import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInDTO {
  @ApiPropertyOptional({
    type: String,
    description: "Email",
    required: true
  })
  @IsOptional()
  @IsString()
  email: string = undefined;

  @ApiProperty({ type: String, description: "User password", required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
