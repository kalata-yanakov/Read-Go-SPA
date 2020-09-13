import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "src/auth/auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "src/constants/secret";
import { JwtPayload } from "src/common/jwt-payload";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,

    });
  }

  async validate(payload: JwtPayload) {

    const user = await this.authService.findUserByName(payload.username);

    if(!user) {
      return;
    }

    if(user.banEndDate && user.banEndDate.valueOf() > Date.now()) {
      return false;
    }
    
    return user;
  }
}

