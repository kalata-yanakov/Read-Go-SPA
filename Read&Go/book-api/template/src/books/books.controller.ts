import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ReviewsService } from './reviews.service';
import { ResponseBookDTO } from './dtos/response-book-dto';
import { ReviewDTO } from './dtos/review-dto';
import { ResponseReviewDTO } from './dtos/response-review-dto';
import { UserId } from 'src/auth/user-id.decorator';
import { BlacklistGuard } from 'src/auth/blacklist.guard';
import { RateBookDTO } from './dtos/rate-book-dto';
import { Reaction } from 'src/users/enums/reaction.enum';

@Controller('api/books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @UseGuards(BlacklistGuard)
  public async retrieveAllBooks(
    @Query('title') title: string,
  ): Promise<Partial<ResponseBookDTO>[]> {
    const books = await this.booksService.retrieveAllBooks();

    if (title) {
      return books.filter(book =>
        book.title.toLowerCase().includes(title.toLowerCase()),
      );
    }
    return books;
  }


  


  @Get(':bookId')
  @UseGuards(BlacklistGuard)
  public async viewIndividualBook(
    @Param('bookId') bookId: string,
  ): Promise<Partial<ResponseBookDTO>> {
    return await this.booksService.viewIndividualBook(bookId);
  }

  @Get('/borrowed/pisnami')
  @UseGuards(BlacklistGuard)
  public async getBorrowedBooks(
    @UserId() userId: number,
  ): Promise<any> {
    return await this.booksService.getBorrowedBooks(userId);
  }
 
 


  @Put(':bookId')
  @UseGuards(BlacklistGuard)
  public async borrowBook(
    @Param('bookId') bookId: string,
    @UserId() userId: number,
  ): Promise<Partial<ResponseBookDTO>> {
   
    return await this.booksService.borrowBook(bookId, userId);
  }

  @Delete(':bookId')
  @UseGuards(BlacklistGuard)
  public async returnBook(
    @Param('bookId') bookId: string,
    @UserId() userId: number,
  ): Promise<Partial<ResponseBookDTO>> {
    return await this.booksService.returnBook(bookId, userId);
  }

  @Put(':bookId/rate')
  @UseGuards(BlacklistGuard)
  public async rateBook(
    @Param('bookId') bookId: string,
    @Body(new ValidationPipe()) rate: RateBookDTO,
    @UserId() userId: number,
  ): Promise<Partial<ResponseBookDTO>> {
    return await this.booksService.rateBook(bookId, rate, userId);
  }

  @Get(':bookId/reviews')
  @UseGuards(BlacklistGuard)
  public async readBookReviews(
    @Param('bookId') bookId: string,
  ): Promise<Partial<ResponseReviewDTO>[]> {
    return await this.reviewsService.readBookReviews(+bookId);
  }

  @Post(':bookId/reviews')
  @UseGuards(BlacklistGuard)
  public async createBookReview(
    @Param('bookId') bookId: string,
    @Body(new ValidationPipe({ whitelist: true })) review: ReviewDTO,
    @UserId() userId: number,
  ): Promise<Partial<ResponseReviewDTO>> {
    return await this.reviewsService.createBookReview(bookId, review, userId);
  }

  @Put(':bookId/reviews/:reviewId')
  @UseGuards(BlacklistGuard)
  public async updateBookReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @Body(new ValidationPipe({ whitelist: true })) review: ReviewDTO,
    @UserId() userId: number,
  ): Promise<Partial<ResponseReviewDTO>> {
    return await this.reviewsService.updateBookReview(
      bookId,
      reviewId,
      review,
      userId,
    );
  }

  @Delete(':bookId/reviews/:reviewId')
  @UseGuards(BlacklistGuard)
  public async deleteBookReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @UserId() userId: number,
  ): Promise<Partial<ResponseReviewDTO>> {
    return await this.reviewsService.deleteBookReview(bookId, reviewId, userId);
  }

  @Put(':bookId/reviews/:reviewId/votes')
  @UseGuards(BlacklistGuard)
  public async likeBookReview(
    @Param('bookId') bookId: string,
    @Param('reviewId') reviewId: string,
    @UserId() userId: number,
    @Body() vote: { reaction: Reaction },
  ): Promise<any> {
    return await this.reviewsService.likeBookReview(
      bookId,
      reviewId,
      userId,
      vote.reaction,
    );
  }
}
