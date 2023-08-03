import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
