import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/models/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtPayload } from "src/common/jwt-payload";
import { UserRole } from "src/users/enums/user-role.enum";
import { JwtService } from "@nestjs/jwt";
import { UserCredentialsDTO } from "src/books/dtos/user-credentials-dto";
import { Token } from "src/models/token.entity";

@Injectable()

export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    
  ) { }

  async findUserByName(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
        isDeleted: false
      } 
    })
  }

  async blacklist(token: string) {
    const tokenEntity = this.tokenRepository.create();
    tokenEntity.token = token;
    
    await this.tokenRepository.save(tokenEntity)
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return !!(await this.tokenRepository.findOne({
     where: {
       token
     }
    }));
  }

  async validateUser(username: string, password: string) {
    const user = await this.findUserByName(username)

    if(!user) {
      return null;
    }

    const isUserValidated = await bcrypt.compare(password, user.password);
    return isUserValidated 
      ? user
      : null;
  }

    async login(loginUser: UserCredentialsDTO): Promise<{ token: string}> {
      const user = await this.validateUser(loginUser.username, loginUser.password);

      if(!user) {
        throw new UnauthorizedException(`Wrong credentials`)
      }
      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        role: UserRole[user.role],
      };

      const token = await this.jwtService.signAsync(payload)

      return {
        token,
      };
    }

}