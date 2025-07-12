import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
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

export class CreateClientDto {
    @IsEmail()
    email:string

    @IsString()
    @MinLength(5)
    password?:string

    @IsString()
    @IsDefined()
    shippingMark?:string

    @IsString()
    @IsDefined()
    phone?:string
}

export class AttachmentDto{
    @IsString()
    @IsOptional()
    filename?:string
}
