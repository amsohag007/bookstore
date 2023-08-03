import { Module } from '@nestjs/common';
import { BookController } from './controllers';
import { BookService } from './services';

@Module({
  imports: [],
  controllers: [BookController],
  providers: [BookService],
})
export class BooksModule {}
