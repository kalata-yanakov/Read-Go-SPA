import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCredentialsDTO } from 'src/books/dtos/user-credentials-dto';
import { TransformService } from 'src/books/transform.service';

@Injectable()
export class UsersService {

constructor(
  @InjectRepository(User) private readonly usersRepository: Repository<User>,
  private readonly transformer: TransformService,)
  {}

  public async create(userDTO: UserCredentialsDTO): Promise<any> {

      const user = this.usersRepository.create(userDTO);

      user.password = await bcrypt.hash(user.password, 10);

      const created = await this.usersRepository.save(user)

      return this.transformer.toUserDTO(created);
  } 

  public async banUser(userId: number, period: number) {
    
    const user = await this.findOneOrFail(userId);

    user.banEndDate = new Date(Date.now() + period)

    return await this.usersRepository.save(user);
  }

  
  private async findOneOrFail(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
        throw new Error('No user!')
    }

    return user;
}

}
