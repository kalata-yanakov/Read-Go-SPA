import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/strategy/jwt-stategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/constants/secret';
import { Token } from 'src/models/token.entity';

@Module({
    
   imports: [TypeOrmModule.forFeature([User, Token]), PassportModule, 
   JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: {
          expiresIn: '7d',
        },
      }),],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,],
    exports: [AuthService]
    
})
export class AuthModule {}
