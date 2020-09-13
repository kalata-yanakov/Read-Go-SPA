import { ExceptionFilter, ArgumentsHost, Catch } from "@nestjs/common";
import { Response } from "express";
import { BooksSystemError, ErrorType } from "./books-system.error";

@Catch(BooksSystemError)
export class BooksSystemErrorFilter implements ExceptionFilter {
  catch(exception: BooksSystemError , host: ArgumentsHost) {
    
    const response = host.switchToHttp().getResponse<Response>();

     return response
              .status(exception.errorCode)
              .json({
                  message: ErrorType[exception.errorCode],
                  description: exception.message
              });
  }
} 