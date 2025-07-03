import { Controller } from '@nestjs/common';
import { MailService } from './mailer.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ResetPasswordEventDto } from './dtos/resetpassword.dto';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailService: MailService) {
  }
  
  @OnEvent("reset.password")
  resetPassword(payload:ResetPasswordEventDto){
    return this.mailService.sendResetPasswordLink(payload)
  }
}
