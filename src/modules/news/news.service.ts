import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, News } from './schemas/news.schema';
import { Model } from 'mongoose';
import { GetQuery } from '@news/news.controller';

@Injectable()
export class NewsServices {
  constructor(
    @InjectModel(News.name)
    private newsModel: Model<News>,
  ) {}

  async createNews(
    title: string,
    categories: Category[],
    imgUrl: string,
    description: string,
    content: string,
    authorId: string,
    authorUsername: string,
  ) {
    return this.newsModel.create({
      title,
      categories,
      imgUrl,
      description,
      content,
      authorId,
      authorUsername,
    });
  }

  deleteNews(id: string) {
    return this.newsModel.deleteOne({ id });
  }

  modifyNews(id: string, data) {
    return this.newsModel.updateOne({ id, ...data });
  }

  getNews(query: GetQuery) {
    const { page, limit } = query;

    return this.newsModel
      .find(this.filtersConfig(query))
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  getCountOfNews(query: GetQuery) {
    return this.newsModel.countDocuments(this.filtersConfig(query));
  }

  getOneNews(id: string) {
    return this.newsModel.findById(id);
  }

  filtersConfig({ categories, author, createdFrom, createdTo }: GetQuery) {
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
