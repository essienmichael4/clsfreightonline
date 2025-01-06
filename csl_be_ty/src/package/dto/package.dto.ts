import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Status } from "../entities/package.entity"

export class PackageRequest {
    @IsString()
    @IsNotEmpty()
    customer:string 

    @IsEmail()
    @IsOptional()
    email?:string

    @IsString()
    @IsOptional()
    phone?:string

    @IsString()
    @IsOptional()
    description?:string

    @IsString()
    trackingNumber:string

    @IsNumber()
    cbm:number

    @IsNumber()
    quantity:number

    @IsString()
    package:string

    @IsString()
    vessel:string

    @IsString()
    @IsOptional()
    loaded:string

    @IsString()
    @IsOptional()
    received:string

    @IsString()
    @IsOptional()
    eta:string

    @IsEnum(Status)
    status:Status
}

export class EditPackageRequest {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    customer?:string 

    @IsEmail()
    @IsOptional()
    email?:string

    @IsString()
    @IsOptional()
    phone?:string

    @IsString()
    @IsOptional()
    trackingNumber?:string

    @IsNumber()
    @IsOptional()
    cbm?:number

    @IsNumber()
    @IsOptional()
    quantity?:number

    @IsString()
    @IsOptional()
    package?:string

    @IsString()
    @IsOptional()
    vessel?:string
}
