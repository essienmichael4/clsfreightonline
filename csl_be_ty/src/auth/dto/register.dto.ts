import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class UserSignUpRequest{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsEmail()
    email:string

    @IsString()
    @MinLength(7)
    password:string
}
