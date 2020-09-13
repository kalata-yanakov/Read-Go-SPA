import { Books } from "src/models/books.entity";
import { ResponseBookDTO } from "./dtos/response-book-dto";
import { Reviews } from "src/models/review.entity";
import { ResponseReviewDTO } from "./dtos/response-review-dto";
import { User } from "src/models/user.entity";
import { UserCredentialsDTO } from "./dtos/user-credentials-dto";

export class TransformService {


  
  toReturnReviewsDTO(reviews: Reviews, stop = false): Partial<ResponseReviewDTO> {
    if (stop) {
      return {
        
        id: reviews.id,
        content: reviews.content,
        user: reviews.users,
        votes: reviews.votes

    } 
  }
    return {
      id: reviews.id,
      content: reviews.content,
      user: reviews.users,
      votes: reviews.votes,

      books: this.toBookResponseDTO(reviews.books, true)
    };
};

toBookResponseDTO(book: Books, stop = false): Partial<ResponseBookDTO> {
  if (stop) {
    return {
      id: book.id,
      content: book.content,
      title: book.title,
      isBorrowed: book.isBorrowed,
      rating: book.rating,
      isFree: book.isFree,
  } 
}
  return {
    id: book.id,
    content: book.content,
    title: book.title,
    isBorrowed: book.isBorrowed,
    rating: book.rating,
    isFree: book.isFree,
    reviews: book.reviews.map(b => this.toReturnReviewsDTO(b, true))
    }
  }

  

  toUserDTO(user: User): Partial<UserCredentialsDTO> {
    return {
        username: user.username,
        password: user.password
    }
  }
}