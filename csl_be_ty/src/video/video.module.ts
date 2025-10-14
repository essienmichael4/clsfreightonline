import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { UploadService } from 'src/upload/upload.service';
import { UploadModule } from 'src/upload/upload.module';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { User } from 'src/user/entities/user.entity';
import { Client } from 'src/user/entities/client.entity';
import { VideoLike } from './entities/video-like.entity';
import { VideoComment } from './entities/video-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, VideoLike, VideoComment, User, Client]),UploadModule],
  controllers: [VideoController],
  providers: [VideoService, UploadService, JwtService],
})
export class VideoModule {}
