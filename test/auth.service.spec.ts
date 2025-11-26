import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { UserService } from '../src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

const mockUser = {
  _id: { toString: () => 'someUserId' },
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashedpassword',
};

const mockUserService = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mockedAccessToken'),
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Тести login ---
  describe('login', () => {
    const email = 'test@example.com';
    const password = 'plainpassword';

    it('should throw UnauthorizedException if user is not found', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Wrong password'),
      );
    });

    it('should return an access token object on successful login', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('validToken');

      const result = await service.login(email, password);

      expect(result).toEqual({ access_token: 'validToken' });
    });
  });

  // --- Тести signup ---
  describe('signup', () => {
    const email = 'new@example.com';
    const username = 'newuser';
    const password = 'newpassword';

    it('should create a user and return an access token object', async () => {
      const newUserMock = {
        _id: { toString: () => 'newUserId' },
        email,
        username,
        password: 'newHashedPassword',
      };

      (userService.createUser as jest.Mock).mockResolvedValue(newUserMock);
      (jwtService.sign as jest.Mock).mockReturnValue('newValidToken');

      const result = await service.signup(email, username, password);

      expect(result).toEqual({ access_token: 'newValidToken' });
    });
  });
});
