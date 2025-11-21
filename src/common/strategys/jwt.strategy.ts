import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: { sub: string; email: string; username: string }) {
    const data: UserPayload = {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };

    return data;
  }
}

export interface UserPayload {
  userId: string;
  email: string;
  username: string;
}
