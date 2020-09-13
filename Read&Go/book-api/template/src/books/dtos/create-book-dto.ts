import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDTO {
    
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}