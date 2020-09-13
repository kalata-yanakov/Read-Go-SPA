import { Controller, Post, Body, ValidationPipe, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserCredentialsDTO } from "src/books/dtos/user-credentials-dto";
import { GetToken } from "./get-token.decorator";


@Controller('session')

export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}


  @Post()
  async login(@Body(new ValidationPipe({whitelist: true})) userDto: UserCredentialsDTO): 
  Promise<{token: string}> {
    return await this.authService.login(userDto)
  }

  @Delete()
  async logout(@GetToken() token: string): Promise<{ message: string }> {
    
    await this.authService.blacklist(token?.slice(7))

    return {
      message: 'You have been logged out!'
    }
  }
}