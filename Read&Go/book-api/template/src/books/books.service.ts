import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/models/books.entity';
import { Repository } from 'typeorm';
import { ResponseBookDTO } from './dtos/response-book-dto';
import { TransformService } from './transform.service';
import { ErrorType, BooksSystemError } from 'src/erorr-handling/books-system.error';
import { RateBookDTO } from './dtos/rate-book-dto';
import { Rate } from 'src/models/rate.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Books) private readonly booksRepository: Repository<Books>,
    @InjectRepository(Rate) private readonly rateRepository: Repository<Rate>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly transformer: TransformService
  ) { }

  public async retrieveAllBooks(): Promise<Partial<ResponseBookDTO>[]> {
    const allBooks = await this.booksRepository.find({
      where: {
        isBorrowed: false,
        isFree: true,
        isDeleted: false,
      },
      relations: ['reviews', 'rating', 'reviews.users', 'reviews.votes'],

    });

    const result = allBooks.map((book) => ({ ...book, reviews: book.reviews.filter((rev) => rev.isDeleted === false) }));
    return result.map(book => this.transformer.toBookResponseDTO(book))
  }

  public async viewIndividualBook(bookId: string): Promise<Partial<ResponseBookDTO>> {
    const foundBook = await this.booksRepository.findOne({
      where: {
        id: bookId,
      },
      relations: ['reviews', 'rating']
    });
    this.validateBook(foundBook);

    const result = { ...foundBook, reviews: foundBook.reviews.filter((rev) => rev.isDeleted === false) };
    return this.transformer.toBookResponseDTO(result);
  }

  public async getBorrowedBooks(userId: number){

  return await this.booksRepository.find({
       where:
       {
      users: userId
       },
         relations: ['users']
       })
  }

  public async borrowBook(bookId: string, userId: number): Promise<Partial<ResponseBookDTO>> {
    const foundBook = await this.booksRepository.findOne({
      where: {
        id: bookId,
        isFree: true,
        isBorrowed: false,
        isDeleted: false,
      },
      relations: ['reviews', 'users']
    });

    
  
    const foundUser = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: ['books']
    });

    if (!foundBook) {
      throw new BooksSystemError(`There is no such a book or it has been borrowed.`, ErrorType.Missing_Entity)
    }

    
    if(!foundUser){
      throw new BooksSystemError(`NESHTO STAA`, ErrorType.Invalid_Operation)
    }


    const borrowedBook = { ...foundBook, "isBorrowed": true, "isFree": false, "users": foundUser };


    const result = await this.booksRepository.save(borrowedBook as any);

    return this.transformer.toBookResponseDTO(result)
  }

  public async returnBook(bookId: string, userId: number,): Promise<Partial<ResponseBookDTO>> {
    const foundBook = await this.booksRepository.findOne({
      where: {
        id: +bookId,
      },
      relations: ['reviews', 'users']
    });


    
    


    if (foundBook.users === null || foundBook.users.id !== userId) {
      throw new BooksSystemError(`you cannot return a book u havent borrowed`, ErrorType.Invalid_Operation)
    }
    if (!foundBook) {
      throw new BooksSystemError(`There is no such a user.`, ErrorType.Missing_Entity)
    }
    else if (foundBook.isBorrowed === false) {
      throw new BooksSystemError('You cannot return an already returned book.', ErrorType.Invalid_Operation)
    }

    const result = await this.booksRepository.save({ ...foundBook, "isBorrowed": false, "isFree": true, "users": null });

    
    return this.transformer.toBookResponseDTO(result);

  }

  public async rateBook(bookId: string, rate: RateBookDTO, userId: number): Promise<any> {
    const BooktoRate = await this.booksRepository.findOne({
      where: {
        id: bookId,
        isBorrowed: false,
      },
      relations: ['users', 'rating']
    })
    this.validateBook(BooktoRate);
    const rater = await this.userRepository.findOne({
      where: {
        id: userId,
      }
    })
    if (!rater) {
      throw new BooksSystemError(`invalid user id`, ErrorType.Invalid_Operation)
    }


    const ratingToSave = this.rateRepository.create(rate)
    ratingToSave.books = BooktoRate
    ratingToSave.rater = rater


    const rateUpdate = await this.rateRepository.findOne({
      where: {
        books: bookId,
        rater: userId,
      },
      relations: ['books', 'rater']
    })

    if (!rateUpdate) {
 
      return await this.rateRepository.save(ratingToSave)
    } else {
      rateUpdate.rating = rate.rating;
  
      return await this.rateRepository.save(rateUpdate)
    }

  }

  private validateBook(book: Books) {
    if (!book) {
      throw new BooksSystemError(`There is no such book`, ErrorType.Missing_Entity)
    }
    if (book.isBorrowed === true) {
      throw new BooksSystemError(`Sorry the book is already borrowed.`, ErrorType.Invalid_Operation)
    }
    if (book.isFree === false) {
      throw new BooksSystemError(`Sorry the book is not free and cannot be borrowed`, ErrorType.Invalid_Operation)
    }
  }
}