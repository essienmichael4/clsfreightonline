import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsEmail()
    email:string

    @IsString()
    @MinLength(5)
    password?:string
}
