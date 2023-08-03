import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { AuthenticationsModule } from './authentications/authentications.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [CoreModule, AuthenticationsModule, UsersModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
