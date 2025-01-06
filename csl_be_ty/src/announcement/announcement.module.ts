import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { JwtService } from '@nestjs/jwt';
import { Announcement } from './entities/announcement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement]), UserModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, JwtService],
})
export class AnnouncementModule {}
