import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from '@news/news.controller';
import { NewsServices } from '@news/news.service';
import { News, NewsSchema } from '@news/schemas/news.schema';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    CommonModule,
  ],
  providers: [NewsServices],
  controllers: [NewsController],
  exports: [NewsServices],
})
export class NewsModule {}
