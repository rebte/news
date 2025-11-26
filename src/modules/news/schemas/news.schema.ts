import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'libs/news-core/domain/News';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class News extends Document {
  @Prop({ required: true, maxLength: 100 })
  title: string;

  @Prop({ type: Types.Array, required: true })
  categories: Category[];

  @Prop({ required: true, maxLength: 100 })
  imgUrl: string;

  @Prop({ required: true, maxLength: 300 })
  description: string;

  @Prop({ required: true, maxLength: 1000 })
  content: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  authorUsername: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});
