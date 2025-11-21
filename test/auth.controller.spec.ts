import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

const mockLoginDto = {
  email: 'test@example.com',
  password: 'password',
};
const mockSignupDto = {
  email: 'new@example.com',
  username: 'newuser',
  password: 'newpassword',
};
const mockToken = { access_token: 'mockedAccessToken' };

const mockAuthService = {
  login: jest.fn(),
  signup: jest.fn(),
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

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  describe('login', () => {
    it('should call authService.login and return OK status with token', async () => {
      const res = mockResponse();
      (authService.login as jest.Mock).mockResolvedValue(mockToken);

      await controller.login(mockLoginDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        access_token: mockToken.access_token,
        message: 'OK',
      });
    });

    it('should handle errors and return BAD_GATEWAY status', async () => {
      const res = mockResponse();
      (authService.login as jest.Mock).mockRejectedValue(
        new UnauthorizedException('Wrong password'),
      );
      
      await controller.login(mockLoginDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
      expect(res.json).toHaveBeenCalledWith({ message: 'BAD GATEWAY' });
    });
  });

  describe('signup', () => {
    it('should call authService.signup and return OK status with token', async () => {
      const res = mockResponse();
      (authService.signup as jest.Mock).mockResolvedValue(mockToken);

      await controller.signup(mockSignupDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        access_token: mockToken.access_token,
        message: 'OK',
      });
    });

    it('should handle errors and return BAD_GATEWAY status', async () => {
      const res = mockResponse();
      (authService.signup as jest.Mock).mockRejectedValue(
        new Error('User already exists'),
      );

      await controller.signup(mockSignupDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
      expect(res.json).toHaveBeenCalledWith({ message: 'BAD GATEWAY' });
    });
  });
});