import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    name:string 

    @IsEmail()
    @IsOptional()
    email:string
}

export class ClientUpdateRequest {
    @IsString()
    @IsOptional()
    shippingMark:string 

    @IsString()
    @IsOptional()
    phone:string
}

export class ClientPaymentRequest {
    @IsNumber()
    @IsPositive()
    paidShippingRate:number 

    @IsString()
    @IsOptional()
    paymentMethod:string

    @IsString()
    @IsOptional()
    reference:string
}

export class ClientInfoUpdateRequest {
    @IsString()
    @IsOptional()
    location:string 

    @IsString()
    @IsOptional()
    nextOfKinPhone:string

    @IsString()
    @IsOptional()
    nextOfKin:string

    @IsString()
    @IsOptional()
    dob:string
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
