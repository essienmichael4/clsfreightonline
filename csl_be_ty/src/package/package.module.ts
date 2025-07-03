import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackageEdit } from './entities/packageEdits.entity';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'src/user/entities/client.entity';
import { PackageType } from './entities/packageType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Package, PackageEdit, PackageType])],
  controllers: [PackageController],
  providers: [PackageService, JwtService],
})
export class PackageModule {}
