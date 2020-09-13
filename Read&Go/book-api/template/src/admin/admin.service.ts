import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/models/books.entity';
import { Repository } from 'typeorm';
import { Reviews } from 'src/models/review.entity';
import { CreateBookDTO } from 'src/books/dtos/create-book-dto';
import { BooksSystemError, ErrorType } from 'src/erorr-handling/books-system.error';
import { ReviewDTO } from 'src/books/dtos/review-dto';
import { ResponseReviewDTO } from 'src/books/dtos/response-review-dto';
import { ResponseBookDTO } from 'src/books/dtos/response-book-dto';


@Injectable()
export class AdminService {
  constructor(
  @InjectRepository(Books) private readonly booksRepository: Repository<Books>,
  @InjectRepository(Reviews) private readonly reviewsRepository: Repository<Reviews>
  ){}
  async getAllBooks(): Promise<Partial<ResponseBookDTO>[]> {
    return this.booksRepository.find({
      relations: ['reviews', 'users']
    })
  }
  async getOneBook(bookId: number): Promise<Partial<ResponseBookDTO>> {
    return await this.findOneBookOrFail(bookId)
  }
  async createOneBook(book: CreateBookDTO): Promise<Partial<ResponseBookDTO>> {
    const createBook =  this.booksRepository.create(book)
    const createdBook = await this.booksRepository.save(createBook);

    
    return createdBook;
  }

  async updateOneBook(bookId: number, book: any): Promise<Partial<ResponseBookDTO>> {
  const bookToUpdate = await this.findOneBookOrFail(bookId)
  const updatedBook = await this.booksRepository.save({...bookToUpdate, ...book})
  return updatedBook;
}
async deleteOneBook(bookId: number): Promise<Partial<ResponseBookDTO>> {
  const bookToDelete = await this.booksRepository.findOne({
    where: {
      id: bookId,
    }
  })
  if(!bookToDelete){
    throw new BooksSystemError('there is no such book.', ErrorType.Missing_Entity)
  }
  return await this.booksRepository.save({...bookToDelete, "isDeleted": true})
}
async createOneReview(bookId: number, review: ReviewDTO): Promise<Partial<ResponseReviewDTO>> {
 const findbook = await  this.findOneBookOrFail(bookId);
const createBookReview =  this.reviewsRepository.create(review)

createBookReview.books = findbook

const savedReview = await this.reviewsRepository.save(createBookReview)
  return savedReview
}
async getReviews(bookId: number): Promise<Partial<ResponseReviewDTO>> {
 const reviews = this.findOneBookOrFail(bookId)

    return reviews
  }

async getOneReview(bookId: number, revId: number): Promise<Partial<ResponseReviewDTO>[]> {
  const review = await  this.booksRepository.findOne({
    where:{
      id: bookId
    },
    relations: ['reviews']
  })

  const result = review.reviews.filter(r => r.id === revId);
   if (result.length === 0) {
     throw new BooksSystemError(`there is no review with Id: ${revId} `, ErrorType.Missing_Entity)
   } else {
   return result
   }
}
async updateReview(bookId: number, revId: number, review: ReviewDTO ): Promise<Partial<ResponseReviewDTO>> {
  const book = await this.findOneBookOrFail(bookId);

  const reviewToUpdate = await this.reviewsRepository.findOne({
    where: {
      id: revId,
      isDeleted: false,
    },
  relations: ['books']
});

  if(!reviewToUpdate) {
    throw new BooksSystemError(`Review with id ${revId} does not exist!`, ErrorType.Missing_Entity)
  }
  if (book.id !== reviewToUpdate.books.id) {
    throw new BooksSystemError('This is not the correct book to update', ErrorType.Missing_Entity)
  } else {
    reviewToUpdate.content = review.content;
  }

  return await this.reviewsRepository.save(reviewToUpdate)

}
async deleteReview(bookId: number, revId: number): Promise<Partial<ResponseReviewDTO>> {
  const findBook = await this.findOneBookOrFail(bookId);

  const reviewToDelete = await this.reviewsRepository.findOne({
    where: {
      id: revId,
    },
    relations: ['books']
  })

  if (!reviewToDelete) {
    throw new BooksSystemError('No review found', ErrorType.Missing_Entity);
  } 
  if (!findBook) {
    throw new BooksSystemError(`No book with id ${bookId} found`, ErrorType.Missing_Entity);
  }  
  if (findBook.id !== reviewToDelete.books.id) {
    throw new BooksSystemError('This is not the correct book', ErrorType.Invalid_Operation)
  } 

  reviewToDelete.isDeleted = true;

 return await this.reviewsRepository.save(reviewToDelete);

}

private async findOneBookOrFail(bookId: number) {
  const book = await this.booksRepository.findOne({
    where: {
    id: bookId,
    },
    relations: ['reviews'],
  })
  
  if (!book) {
    throw new BooksSystemError('There is no such a book.', ErrorType.Invalid_Operation)
  }
  return book
  }

}
