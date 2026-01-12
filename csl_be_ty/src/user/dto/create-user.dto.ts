import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "../entities/user.entity"
import { ApiProperty } from "@nestjs/swagger"

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

    @ApiProperty({
        type: String,
        isArray: true,
        description: "option values",
        example: ["Operations Manager", "Carrier"],
        required: false
    })
    @IsOptional()
    departments?:string[]
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

    @IsString()
    @IsDefined()
    location?:string
}

export class AttachmentDto{
    @IsString()
    @IsOptional()
    filename?:string
}
