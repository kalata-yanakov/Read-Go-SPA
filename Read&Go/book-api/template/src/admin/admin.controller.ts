import { Controller, Get, Param, Body, Post, Put, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateBookDTO } from 'src/books/dtos/create-book-dto';
import { ReviewDTO } from 'src/books/dtos/review-dto';
import { ResponseReviewDTO } from 'src/books/dtos/response-review-dto';
import { ResponseBookDTO } from 'src/books/dtos/response-book-dto';
import { UserRole } from 'src/users/enums/user-role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { BlacklistGuard } from 'src/auth/blacklist.guard';
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('books')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async getAllBooks(): Promise<Partial<ResponseBookDTO>[]> {
    return await this.adminService.getAllBooks()
  }

  @Get('books/:bookId')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async getOneBook(@Param('bookId') bookId: string): Promise<Partial<ResponseBookDTO>> {
    return await this.adminService.getOneBook(+bookId)
  }

  @Post('books')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async createOneBook(@Body(new ValidationPipe({ whitelist: true })) book: CreateBookDTO): Promise<Partial<ResponseBookDTO>> {
    return await this.adminService.createOneBook(book)
  }


  // тука ще треа да се допипа.
  @Put('books/:bookId')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async updateOneBook(@Param('bookId') bookId: string, @Body() book: any): Promise<Partial<ResponseBookDTO>> {
    return await this.adminService.updateOneBook(+bookId, book)
  }

  @Delete('books/:bookId')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async deleteOneBook(@Param('bookId') bookId: string): Promise<Partial<ResponseBookDTO>> {
    return await this.adminService.deleteOneBook(+bookId)
  }

  
  @Post('books/:bookId/reviews')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async createOneReview(
    @Param('bookId') bookId: string, 
    @Body(new ValidationPipe({ whitelist: true })) review: ReviewDTO): Promise<Partial<ResponseReviewDTO>> {
    return await this.adminService.createOneReview(+bookId, review);
  }
 
  @Get('books/:bookId/reviews')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async getReviews(@Param('bookId') bookId: string): Promise<Partial<ResponseReviewDTO>> {
    return await this.adminService.getReviews(+bookId);
  }
 
  @Get('books/:bookId/reviews/:reviewId')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async getOneReview(
    @Param('bookId') bookId: string, 
    @Param('reviewId') revId: string): Promise<Partial<ResponseReviewDTO>[]> {
    return await this.adminService.getOneReview(+bookId, +revId);
  }

  
  @Put('books/:bookId/reviews/:reviewId')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async updateReview(
  @Param('bookId') bookId: string, 
  @Param('reviewId') revId: string,
  @Body(new ValidationPipe({ whitelist: true })) review: ReviewDTO,): Promise<Partial<ResponseReviewDTO>> {
    return await this.adminService.updateReview(+bookId, +revId, review);
  }

  @Delete('books/:bookId/reviews/:reviewId')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  public async deleteReview(
    @Param('bookId') bookId: string, 
    @Param('reviewId') revId: string): Promise<Partial<ResponseReviewDTO>>{
    return await this.adminService.deleteReview(+bookId, +revId);
  }



}
