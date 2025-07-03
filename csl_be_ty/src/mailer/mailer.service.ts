import { Injectable } from '@nestjs/common';
import { ResetPasswordEventDto } from './dtos/resetpassword.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService){}

    async sendResetPasswordLink(payload: ResetPasswordEventDto){
        return await this.mailerService.sendMail({
            to: payload.email,
            from: process.env.EMAIL_SENDER,
            subject: "Password reset - CSL Freight",
            template: "resetPassword",
            context: {
                link: payload.link,
                email: payload.email,
            }
        })
    }
}
