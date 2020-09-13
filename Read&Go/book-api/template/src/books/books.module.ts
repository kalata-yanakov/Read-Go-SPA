import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/models/books.entity';
import { Reviews } from 'src/models/review.entity';
import { TransformService } from './transform.service';
import { User } from 'src/models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Rate } from 'src/models/rate.entity';
import { Vote } from 'src/models/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books, Reviews, User, Rate, Vote]), AuthModule],
  controllers: [BooksController],
  providers: [BooksService, ReviewsService, TransformService],
 
  
})
export class BooksModule {}
