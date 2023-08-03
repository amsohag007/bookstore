import { Module } from '@nestjs/common';
import { UsersController } from './controllers';
import { UsersService } from './services';
import { AuthenticationsModule } from 'src/authentications/authentications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, AuthenticationsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
