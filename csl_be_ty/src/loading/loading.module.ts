import { Module } from '@nestjs/common';
import { LoadingService } from './loading.service';
import { LoadingController } from './loading.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loading } from './entities/loading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loading])],
  controllers: [LoadingController],
  providers: [LoadingService, JwtService],
})
export class LoadingModule {}
