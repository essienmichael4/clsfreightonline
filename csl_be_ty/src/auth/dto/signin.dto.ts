import { IsEmail, IsString, MinLength } from "class-validator"

export class UserSignInRequest{
    @IsEmail()
    email:string

    @IsString()
    @MinLength(5)
    password:string
}
