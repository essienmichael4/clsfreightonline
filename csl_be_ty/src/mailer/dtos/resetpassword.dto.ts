import { IsDefined, IsEmail, IsString } from "class-validator";

export class ResetPasswordEventDto {
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsDefined()
    @IsString()
    link:string
}
