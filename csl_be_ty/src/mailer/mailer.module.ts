import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';
import { MailController } from './mailer.controller';
import { mailerConfig } from './mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [MailerModule.forRoot(mailerConfig)]
})
export class MailModule {}
