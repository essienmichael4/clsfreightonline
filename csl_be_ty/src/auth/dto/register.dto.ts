import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Role } from "src/user/entities/user.entity"

export class UserSignUpRequest{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsEmail()
    email:string

    @IsEnum(Role)
    role:Role
}
