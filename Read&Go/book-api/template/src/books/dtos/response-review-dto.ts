
import { ResponseBookDTO } from "./response-book-dto";
import { UserCredentialsDTO } from "./user-credentials-dto";
import { Vote } from "src/models/vote.entity";

export class ResponseReviewDTO {

  id: number;

  content: string;

  books: Partial<ResponseBookDTO>

  user: Partial<UserCredentialsDTO>

  votes: Partial<Vote[]>
}