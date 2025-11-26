import { NewsRepository } from './NewsRepository';
import { NewsProps, GetQuery, CreateNewsDto } from '../domain/News';

export class NewsService {
  constructor(private repo: NewsRepository) {}

  async createNews(data: CreateNewsDto) {
    return this.repo.create(data);
  }

  async modifyNews(id: string, updates: Partial<NewsProps>) {
    return this.repo.update(id, updates);
  }

  deleteNews(id: string) {
    return this.repo.delete(id);
  }

  getNews(query: GetQuery) {
    return this.repo.findMany(
      this.filtersConfig(query),
      query.page,
      query.limit,
    );
  }

  getCount(query: GetQuery) {
    return this.repo.count(this.filtersConfig(query));
  }

  getOneNews(id: string) {
    return this.repo.findOne(id);
  }

  private filtersConfig({
    categories,
    author,
    createdFrom,
    createdTo,
  }: GetQuery) {
    const filter: any = {};

    if (categories) {
      filter.categories = { $in: categories };
    }

    if (author) {
      filter.authorUsername = author;
    }

    if (createdFrom) {
      filter.createdAt = { $gte: new Date(createdFrom) };
    }

    if (createdTo) {
      if (!filter.createdAt) filter.createdAt = {};
      filter.createdAt.$lte = new Date(createdTo);
    }

    return filter;
  }
}
