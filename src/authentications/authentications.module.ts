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
import { CoreModule } from '@src/core/core.module';

@Global()
@Module({
  imports: [CoreModule, MailsModule, PassportModule, JwtModule.register({})],
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
