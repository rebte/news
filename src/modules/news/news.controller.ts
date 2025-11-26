import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '@common/guards/auth.guard';
import type { UserPayload } from '@common/strategys/jwt.strategy';
import { GetUser } from '@common/decorators/get-user.decorator';
import { NewsService } from 'libs/news-core/application/NewsService';
import type {
  Category,
  CreateNewsDto,
  GetQuery,
} from 'libs/news-core/domain/News';

@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  async news(@Res() res: Response, @Query() query: GetQuery) {
    try {
      if (!query.limit) {
        query.limit = 10;
      }
      if (!query.page) {
        query.page = 1;
      }
      if (query.categories && typeof query.categories === 'string') {
        query.categories = query.categories.split(',') as Category[];
      }

      const total: number = await this.newsService.getCount(query);
      const news = await this.newsService.getNews(query);

      res.status(HttpStatus.OK).json({
        data: news,
        limit: query.limit,
        page: query.page,
        total,
        message: 'OK',
      });
    } catch (e) {
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD_GATEWAY' });
    }
  }

  @Post()
  async createNews(
    @Body() newsData: CreateNewsDto,
    @GetUser() user: UserPayload,
    @Res() res: Response,
  ) {
    try {
      const news = await this.newsService.createNews({
        ...newsData,
        authorId: user.userId,
        authorUsername: user.username,
      });

      res.status(HttpStatus.OK).json({ data: news, message: 'OK' });
    } catch (e) {
      console.log(e);
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD_GATEWAY' });
    }
  }

  @Get(':id')
  async getOnenews(@Param('id') id: string, @Res() res: Response) {
    this.newsService.deleteNews(id);
    try {
      const news = await this.newsService.getOneNews(id);
      res.status(HttpStatus.OK).json({ data: news, message: 'OK' });
    } catch (e) {
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD_GATEWAY' });
    }
  }

  @Delete(':id')
  async deleteNews(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.newsService.deleteNews(id);
      res.status(HttpStatus.OK).json({ message: 'OK' });
    } catch (e) {
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD_GATEWAY' });
    }
  }

  @Put(':id')
  async modifyNews(
    @Param('id') id: string,
    @Body() data: CreateNewsDto,
    @Res() res: Response,
  ) {
    try {
      await this.newsService.modifyNews(id, data);
      res.status(HttpStatus.OK).json({ message: 'OK' });
    } catch (e) {
      res.status(HttpStatus.BAD_GATEWAY).json({ message: 'BAD_GATEWAY' });
    }
  }
}
