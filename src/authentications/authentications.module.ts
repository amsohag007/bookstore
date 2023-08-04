import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  AuthPasswordsController,
  AuthenticationsController,
} from './controllers';
import { AuthPasswordsService, AuthenticationsService } from './services';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { MailsModule } from 'src/mails/mails.module';

@Global()
@Module({
  imports: [MailsModule, PassportModule, JwtModule.register({})],
  controllers: [AuthenticationsController, AuthPasswordsController],

  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthenticationsService,
    AuthPasswordsService,
  ],
  exports: [JwtModule, AuthenticationsService],
})
export class AuthenticationsModule {}
