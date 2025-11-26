/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import type { LoginDto } from '../src/modules/auth/dto/login.dto';
import type { SignupDto } from '../src/modules/auth/dto/signup.dto';

const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password',
};
const mockSignupDto: SignupDto = {
  email: 'new@example.com',
  username: 'newuser',
  password: 'newpassword',
};
const mockToken = { access_token: 'mockedAccessToken' };

const mockAuthService = {
  login: jest.fn(() => Promise.resolve(mockToken)),
  signup: jest.fn(() => Promise.resolve(mockToken)),
};

const mockResponse = (): Response => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should successfully log in and return 200 OK with token', async () => {
      const res = mockResponse();
      (authService.login as jest.Mock).mockResolvedValue(mockToken);

      await controller.login(mockLoginDto, res);

      expect(authService.login).toHaveBeenCalledWith(
        mockLoginDto.email,
        mockLoginDto.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        access_token: mockToken.access_token,
        message: 'OK',
      });
    });

    it('should return 502 BAD_GATEWAY on service error', async () => {
      const res = mockResponse();
      (authService.login as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await controller.login(mockLoginDto, res);

      expect(authService.login).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
      expect(res.json).toHaveBeenCalledWith({ message: 'BAD GATEWAY' });
    });
  });

  describe('signup', () => {
    it('should successfully sign up and return 200 OK with token', async () => {
      const res = mockResponse();
      (authService.signup as jest.Mock).mockResolvedValue(mockToken);

      await controller.signup(mockSignupDto, res);

      expect(authService.signup).toHaveBeenCalledWith(
        mockSignupDto.email,
        mockSignupDto.username,
        mockSignupDto.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        access_token: mockToken.access_token,
        message: 'OK',
      });
    });

    it('should return 502 BAD_GATEWAY on service error', async () => {
      const res = mockResponse();
      (authService.signup as jest.Mock).mockRejectedValue(
        new Error('User exists'),
      );

      await controller.signup(mockSignupDto, res);

      expect(authService.signup).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
      expect(res.json).toHaveBeenCalledWith({ message: 'BAD GATEWAY' });
    });
  });
});
