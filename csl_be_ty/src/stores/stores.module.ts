import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/upload/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UploadModule],
  controllers: [StoresController],
  providers: [StoresService, UploadService, JwtService, FileService],
})
export class StoresModule {}
