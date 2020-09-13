import { IsNotEmpty, IsString } from 'class-validator';

export class ReviewDTO {
 
  @IsString()
  @IsNotEmpty()
  content: string;
}