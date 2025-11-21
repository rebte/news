import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { CommonModule } from '@common/common.module';
import { NewsModule } from '@news/news.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DATABASE_USER')}:${configService.get('DATABASE_PASSWORD')}@news.kjjvygl.mongodb.net/newsdb?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UserModule,
    NewsModule,
    CommonModule,
  ],
})
export class AppModule {}
