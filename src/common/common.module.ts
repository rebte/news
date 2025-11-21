import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/auth.guard';
import { JwtStrategy } from '@common/strategys/jwt.strategy';

@Module({
  providers: [JwtAuthGuard, JwtStrategy],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class CommonModule {}
