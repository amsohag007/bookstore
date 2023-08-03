import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthenticationsController } from './controllers';
import { AuthenticationsService } from './services';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule, PassportModule, JwtModule.register({})],
  controllers: [AuthenticationsController],

  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthenticationsService,
  ],
  exports: [JwtModule, AuthenticationsService],
})
export class AuthenticationsModule {}
