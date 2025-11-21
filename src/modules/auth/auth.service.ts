import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found');

    if (await bcrypt.compare(password, user.password)) {
      return this.generateToken(user._id.toString(), email, user.username);
    }

    throw new UnauthorizedException('Wrong password');
  }

  async signup(email: string, username: string, password: string) {
    const user = await this.userService.createUser(email, username, password);
    return this.generateToken(user._id.toString(), email, username);
  }

  generateToken(id: string, email: string, username: string) {
    return {
      access_token: this.jwtService.sign({
        sub: id,
        email,
        username,
      }),
    };
  }
}
