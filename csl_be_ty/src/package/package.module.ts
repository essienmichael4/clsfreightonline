import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackageEdit } from './entities/packageEdits.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageEdit])],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
