import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
  Roles,
} from '../common/decorators';
import { AuthenticationsService } from '../services';
import { JwtResponse } from '../models';
import { SignInDTO, SignupDTO } from '../dtos';
import { Tokens } from '../types';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
  RolesGuard,
} from '../common/guards';
import { ApiResponseDTO } from 'src/core/dtos';
import { User } from 'src/users/entity';

@Controller('auth')
@ApiTags('Authorization')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Public()
  @Post('register')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register an user' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: 'An user has been successfully signed up',
    type: JwtResponse,
  })
  @ApiBody({
    type: SignupDTO,
    description: 'User Sign Up',
  })
  signupLocal(@Body() signupDTO: SignupDTO): Promise<Tokens> {
    return this.authenticationsService.signupLocal(signupDTO);
  }

  @Public()
  @Post('login')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in an User' })
  @ApiBody({
    type: SignInDTO,
    description: 'User Sign In',
  })
  @ApiOkResponse({
    description: 'An user has been successfully signed in',
    type: JwtResponse,
  })
  async signinLocal(@Body() signInDTO: SignInDTO): Promise<Tokens> {
    return await this.authenticationsService.signinLocal(signInDTO);
  }

  @Post('logout')
  @ApiBearerAuth('JWT')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout an User' })
  @UseGuards(AccessTokenGuard)
  async logout(@GetCurrentUserId() userId: string) {
    return await this.authenticationsService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiProduces('application/json')
  @ApiOperation({ summary: 'Refresh Auth Tokens' })
  @ApiOkResponse({
    description: 'An users tokens has been refreshed',
    type: JwtResponse,
  })
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authenticationsService.refreshTokens(userId, refreshToken);
  }

  @Get('me')
  @ApiBearerAuth('JWT')
  @Roles('USER', 'MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiProduces('application/json')
  @ApiOperation({ summary: 'Logged In user info' })
  @ApiOkResponse({
    type: User,
    description: 'Record has been retrieved successfully.',
    isArray: false,
  })
  getCurrentUser(
    @GetCurrentUserId() userId: string,
  ): Promise<ApiResponseDTO<User>> {
    return this.authenticationsService.getCurrentUser(userId);
  }
}
