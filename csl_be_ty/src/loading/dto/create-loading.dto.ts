import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { Status } from "../entities/loading.entity"

export class CreateLoadingDto {
    @IsString()
    @IsOptional()
    vessel:string

    @IsString()
    @IsOptional()
    loaded:string

    @IsString()
    @IsOptional()
    eta:string

    @IsEnum(Status)
    status:Status

    @IsNumber()
    addedBy:number

    @IsString()
    @IsOptional()
    description?:string
}
