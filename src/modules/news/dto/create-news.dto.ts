import { Category } from '@news/schemas/news.schema';

export interface CreateNewsDto {
  title: string;
  categories: Category[];
  imgUrl: string;
  description: string;
  content: string;
}
