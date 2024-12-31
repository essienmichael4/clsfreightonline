import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    name:string 

    @IsEmail()
    @IsOptional()
    email:string
}

export class UpdateUserPasswordRequest {
    @IsString()
    @IsOptional()
    oldPassword:string

    @IsString()
    newPassword:string

    @IsString()
    confirmPassword:string
}
