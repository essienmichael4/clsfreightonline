import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, IsEnum } from "class-validator"
import { Show } from "../entities/marque.entity"
import { ApiProperty } from "@nestjs/swagger"

export class MarqueDto {
    @IsString()
    @IsNotEmpty()
    announcement:string 

    @ApiProperty({
        description: "Review status",
        example: Show.FALSE,
        required: false
    })
    @IsEnum(Show)
    @IsOptional()
    isShown?:Show
}

export class CreateInvoiceAddressDto {
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsString()
    @IsOptional()
    streetAddress?:string

    @IsString()
    addressLine:string

    @IsString()
    city:string

    @IsString()
    @IsOptional()
    state:string

    @IsString()
    @IsOptional()
    box:string
}

export class WarehouseDto {
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsString()
    @IsOptional()
    description?:string
}

export class BankDto {
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsString()
    @IsOptional()
    branch?:string

    @IsString()
    accountNumber?:string

    @IsString()
    accountName?:string
}

export class HelplineDto {
    @IsString()
    @IsNotEmpty()
    phone:string 
}
