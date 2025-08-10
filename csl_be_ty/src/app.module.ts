import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PackageModule } from './package/package.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { AddressModule } from './address/address.module';
import { LoadingModule } from './loading/loading.module';
import { MailModule } from './mailer/mailer.module';
import { UploadModule } from './upload/upload.module';
import { StatisticsModule } from './statistics/statistics.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get("DB_HOST"),
        // port: +configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        // entities: [],
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize:true
      })
    }),
    UserModule,
    PackageModule,
    AuthModule,
    AnnouncementModule,
    AddressModule,
    LoadingModule,
    MailModule,
    UploadModule,
    StatisticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
