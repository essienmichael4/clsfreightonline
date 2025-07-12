import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from 'src/package/entities/package.entity';
import { JwtService } from '@nestjs/jwt';
import { PackageType } from 'src/package/entities/packageType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageType])],
  controllers: [StatisticsController],
  providers: [StatisticsService, JwtService],
})
export class StatisticsModule {}
