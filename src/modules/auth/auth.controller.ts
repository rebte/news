import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import type { LoginDto } from '@auth/dto/login.dto';
import type { SignupDto } from '@auth/dto/signup.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto, @Res() res: Response) {
    try {
      const data = await this.authService.login(email, password);

      res
        .status(HttpStatus.OK)
        .json({ access_token: data.access_token, message: 'OK' });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD GATEWAY' });
    }
  }

  @Post('signup')
  async signup(
    @Body() { email, username, password }: SignupDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.signup(email, username, password);

      res
        .status(HttpStatus.OK)
        .json({ access_token: data.access_token, message: 'OK' });
    } catch (e) {
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD GATEWAY' });
    }
  }
}
