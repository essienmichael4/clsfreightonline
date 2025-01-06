import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateAnnouncementDto {
    @IsString()
    @IsOptional()
    title?:string 

    @IsString()
    @IsNotEmpty()
    subject:string

    @IsNumber()
    updatedBy:number

}
