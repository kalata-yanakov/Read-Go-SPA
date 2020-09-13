import { Controller, Post, Body, ValidationPipe, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDTO } from 'src/books/dtos/user-credentials-dto';
import { UserBanDTO } from 'src/books/dtos/user-ban.dto';
import { BlacklistGuard } from 'src/auth/blacklist.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from './enums/user-role.enum';
import { BooksSystemError, ErrorType } from 'src/erorr-handling/books-system.error';


@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  public async createUser(
    @Body(new ValidationPipe({ whitelist: true, })) userCredentials: UserCredentialsDTO): Promise<any> {
      try {
        return await this.userService.create(userCredentials);
      } catch (error) {
        throw new BooksSystemError(`Username already taken. Please try another username.`, ErrorType.Invalid_Operation)
      }
    
  } 

  @Post(':userId/ban')
  @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
  async banUser(@Param('userId') userId: string, @Body(new ValidationPipe({ whitelist: true })) banDto: UserBanDTO) {
    return await this.userService.banUser(+userId, banDto.period)
  }


}
