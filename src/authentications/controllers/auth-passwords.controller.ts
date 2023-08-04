import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';
import { AuthPasswordsService } from '../services';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyPasswordResetCodeDTO,
} from '../dtos';

@Public()
@Controller('auth/password')
@ApiTags('Authorization Password Reset')
export class AuthPasswordsController {
  constructor(private readonly authPasswordsService: AuthPasswordsService) {}

  @Post('forgot')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forget Password' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'An otp has been sent to email or phone',
  })
  @ApiBody({
    type: ForgotPasswordDTO,
    description: 'Verification code received by user.',
    required: true,
  })
  async initiatePasswordVerification(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ) {
    return await this.authPasswordsService.initiatePasswordVerification(
      forgotPasswordDTO,
    );
  }

  @Post('reset/verify')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Password Reset Code' })
  @ApiOkResponse({
    description: 'You can reset the passwod now',
    status: HttpStatus.OK,
  })
  @ApiBody({
    type: VerifyPasswordResetCodeDTO,
    description: 'Verification code received by user.',
    required: true,
  })
  async resetPassByToken(
    @Body() verifyPasswordResetCodeDTO: VerifyPasswordResetCodeDTO,
  ) {
    return await this.authPasswordsService.verifyPasswordResetCode(
      verifyPasswordResetCodeDTO,
    );
  }

  @Patch('reset')
  @Version('1')
  @ApiOperation({ summary: 'Update Password' })
  @ApiOkResponse({
    description: 'Password Updated',
    type: '',
  })
  @ApiBody({
    type: ResetPasswordDTO,
    description: 'New Password',
  })
  async updatePassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return await this.authPasswordsService.updatePassword(resetPasswordDTO);
  }
}
