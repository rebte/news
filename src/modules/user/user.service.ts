import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    return this.userModel.create({ email, username, password: hashed });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }
}
