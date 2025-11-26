import { NewsProps } from '../domain/News';

export interface NewsRepository {
  create(news: NewsProps): Promise<NewsProps>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<NewsProps>): Promise<void>;
  findOne(id: string): Promise<NewsProps>;
  findMany(filter: any, page: number, limit: number): Promise<NewsProps[]>;
  count(filter: any): Promise<number>;
}
