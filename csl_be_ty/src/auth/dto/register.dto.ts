import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
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

export class ClientSignUpRequest{
    @IsEmail()
    email:string

    @IsString()
    @MinLength(5)
    password?:string

    @IsString()
    @IsDefined()
    phone?:string

    @IsString()
    @MinLength(5)
    confirmPassword?:string

    @IsString()
    @IsDefined()
    shippingMark?:string
}


export class ForgottenPasswordDto {
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string
}

export class ResetPasswordDto {
    @IsDefined()
    @IsString()
    id:string

    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsDefined()
    @IsString()
    @MinLength(8)
    password:string

    @IsDefined()
    @IsString()
    @MinLength(8)
    confirmPassword?:string
}
