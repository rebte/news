import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from '@news/news.controller';
import { News, NewsSchema } from '@news/schemas/news.schema';
import { CommonModule } from '@common/common.module';
import { NewsService } from 'libs/news-core/application/NewsService';
import { NewsRepository } from 'libs/news-core/application/NewsRepository';
import { MongooseNewsRepository } from './infrastructure/mongoose-news.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    CommonModule,
  ],
  providers: [
    {
      provide: NewsService,
      useFactory: (repo: NewsRepository) => new NewsService(repo),
      inject: [MongooseNewsRepository],
    },
    MongooseNewsRepository,
  ],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
