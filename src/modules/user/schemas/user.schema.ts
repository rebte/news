import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, minlength: 8 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
