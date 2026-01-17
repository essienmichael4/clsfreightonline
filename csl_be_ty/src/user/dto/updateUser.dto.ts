import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"
import { ApprovalStatus } from "../entities/client.entity"

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

    @IsString()
    @IsOptional()
    location:string 
}

export class ClientPaymentRequest {
    @IsString()
    @IsOptional()
    datePaid:string

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

export class ClientApprovalUpdateRequest {
    @IsEnum(ApprovalStatus)
    @IsOptional()
    approvalStatus:ApprovalStatus
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
