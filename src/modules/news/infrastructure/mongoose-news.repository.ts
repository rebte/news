import { Injectable } from '@nestjs/common';
import { NewsRepository } from 'libs/news-core/application/NewsRepository';
import { NewsProps } from 'libs/news-core/domain/News';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from '../schemas/news.schema';

@Injectable()
export class MongooseNewsRepository implements NewsRepository {
  constructor(
    @InjectModel(News.name)
    private newsModel: Model<News>,
  ) {}

  async create(news: NewsProps) {
    const created = await this.newsModel.create(news);

    return created.toJSON();
  }

  async delete(id: string) {
    await this.newsModel.deleteOne({ _id: id });
  }

  async update(id: string, data: any) {
    await this.newsModel.updateOne({ _id: id }, data);
  }

  async findMany(filter: any, page, limit) {
    const news = await this.newsModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return news.map((el) => el.toJSON());
  }

  count(filter: any) {
    return this.newsModel.countDocuments(filter);
  }

  async findOne(id: string) {
    const found = await this.newsModel.findById(id);
    return found.toJSON();
  }
}
