import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Client } from './entities/client.entity';
import { Details } from './entities/details.entity';
import { Attachment } from './entities/attachment.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UploadService } from 'src/upload/upload.service';
import { MembershipTier } from './entities/membership.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(),TypeOrmModule.forFeature([User, Client, Details, Attachment, MembershipTier]), UploadModule],
  controllers: [UserController],
  providers: [UserService, JwtService, UploadService],
  exports:[UserService]
})
export class UserModule {}
