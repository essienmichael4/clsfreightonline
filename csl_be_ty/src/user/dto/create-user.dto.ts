import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Role } from "../entities/user.entity"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsEmail()
    email:string

    @IsString()
    @MinLength(5)
    password?:string

    @IsEnum(Role)
    role:Role
}
