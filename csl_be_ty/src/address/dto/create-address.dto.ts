import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    contact:string

    @IsString()
    @IsNotEmpty()
    mobile:string

    @IsString()
    @IsNotEmpty()
    address:string

    @IsNumber()
    updatedBy:number

}

