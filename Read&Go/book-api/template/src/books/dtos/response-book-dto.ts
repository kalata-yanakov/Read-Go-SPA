
import { ResponseReviewDTO } from "./response-review-dto";
import { Rate } from "src/models/rate.entity";


export class ResponseBookDTO {
  
  id: number;

  title: string;

  content: string;

  isBorrowed: boolean;

  isFree: boolean;

  rating: Rate[];

  reviews: Partial<ResponseReviewDTO>[]
  
}