import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/models/books.entity';
import { Repository } from 'typeorm';
import { Reviews } from 'src/models/review.entity';
import { ResponseReviewDTO } from './dtos/response-review-dto';
import { TransformService } from './transform.service';
import { BooksSystemError, ErrorType } from 'src/erorr-handling/books-system.error';
import { ReviewDTO } from './dtos/review-dto';
import { User } from 'src/models/user.entity';
import { Reaction } from 'src/users/enums/reaction.enum';
import { Vote } from 'src/models/vote.entity';



@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Books) private readonly booksRepository: Repository<Books>,
    @InjectRepository(Reviews) private readonly reviewsRepository: Repository<Reviews>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    private readonly transformer: TransformService,
  ) { }

  public async readBookReviews(bookId: number): Promise<Partial<ResponseReviewDTO>[]> {
    const allBooks = await this.findOneBookOrFail(bookId)

    const result = allBooks.reviews.filter(r => r.isDeleted === false)

    return result.map(reviews => this.transformer.toReturnReviewsDTO(reviews))
  }

  public async createBookReview(bookId: string, review: ReviewDTO, userId: number): Promise<Partial<ResponseReviewDTO>> {

    const findBook = await this.findOneBookOrFail(+bookId);
    const createBookReview = this.reviewsRepository.create(review)
    const foundUser = await this.findOneUserOrFail(userId);
    createBookReview.books = findBook;
    createBookReview.users = foundUser;

    const savedReview = await this.reviewsRepository.save(createBookReview);

    return this.transformer.toReturnReviewsDTO(savedReview)
  }

  public async updateBookReview(bookId: string, reviewId: string, review: ReviewDTO, userId: number): Promise<Partial<ResponseReviewDTO>> {
   
    const book = await this.findOneBookOrFail(+bookId)
    const user = await this.findOneUserOrFail(userId);
    const reviewToUpdate = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
        isDeleted: false,
      },
      relations: ['books', 'users', 'votes']
    })

    if (!reviewToUpdate) {
      throw new BooksSystemError(`Review with id ${reviewId} does not exist!`, ErrorType.Missing_Entity)
    }
    if (reviewToUpdate.users.id !== user.id) {
      throw new BooksSystemError(`не си го писал ти брачет!`, ErrorType.Invalid_Operation)
    }

    if (book.id !== reviewToUpdate.books.id) {
      throw new BadRequestException('tva ne e knigata pi4')
    } else {
      reviewToUpdate.content = review.content
    }
    const result = await this.reviewsRepository.save(reviewToUpdate)
    return this.transformer.toReturnReviewsDTO(result)

  }

  public async deleteBookReview(bookId: string, reviewId: string, userId: number): Promise<Partial<ResponseReviewDTO>> {
    const findBook = await this.findOneBookOrFail(+bookId);
    const findUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['reviews']
    })

    const reviewToDelete = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
      },
      relations: ['books', 'users', 'votes']
    })



    // if(!findUser || findBook.users === null){
    //   throw new BooksSystemError(`Oooops, sorry for the inconvenience`, ErrorType.Missing_Entity )
    //}
    if (findUser.id !== reviewToDelete.users.id) {
      throw new BooksSystemError('не си го писал ти че да го триеш преател', ErrorType.Invalid_Operation)
    }

    if (!reviewToDelete || reviewToDelete.users === undefined) {
      throw new BooksSystemError('No review found', ErrorType.Missing_Entity);
    }
    if (!findBook) {
      throw new BooksSystemError(`No book with id ${bookId} found`, ErrorType.Missing_Entity);
    }
    if (findBook.id !== reviewToDelete.books.id) {
      throw new BooksSystemError('This is not the correct book', ErrorType.Invalid_Operation)
    }

    reviewToDelete.isDeleted = true;

    const result = await this.reviewsRepository.save(reviewToDelete);

    return this.transformer.toReturnReviewsDTO(result)

  }

  public async likeBookReview(bookId: string, reviewId: string, userId: number, vote: number): Promise<any> {
    const foundBook = this.findOneBookOrFail(+bookId);



    const UpdateVote = await this.voteRepository.findOne({
      where: {
        reviews: reviewId,
        voter: userId
      },
      relations: ['reviews', 'voter']
    })

    const foundUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      }
    });
    if(!foundUser){
      throw new Error('nema takuv user')
    }
    const foundReview = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
        isDeleted: 'false',
      },
      relations: [ 'votes'],
    });
    
    


    if (!UpdateVote){

      const createVote = this.voteRepository.create();
    createVote.reaction = vote
    createVote.reviews = foundReview
    createVote.voter = foundUser
   await this.voteRepository.save(createVote);
   return await this.voteRepository.find({
     where: {
       reviews: reviewId
     }
   });
    } else {
      UpdateVote.reaction = vote;
   await this.voteRepository.save(UpdateVote)

   return await this.voteRepository.find({
    where: {
      reviews: reviewId
    }
  });
    }
  }


  private async findOneBookOrFail(bookId: number) {
    const book = await this.booksRepository.findOne({
      where: {
        id: bookId,
      },
      relations: ['reviews', 'reviews.books', 'users'],
    })

   
    if (!book) {
      throw new BooksSystemError('There is no such a book.', ErrorType.Invalid_Operation)
    }
    return book
  }

  private async findOneUserOrFail(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['reviews', 'reviews.users']
    })
    if (!user) {
      throw new BooksSystemError('there is no such user', ErrorType.Missing_Entity)
    }
    return user
  }
}