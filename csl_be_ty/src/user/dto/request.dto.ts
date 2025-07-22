import { IsString, MinLength, IsDefined, IsNumber, IsPositive, IsOptional } from "class-validator"

export class CreateMembershipTierDto {
    @IsString()
    @MinLength(2)
    name:string

    @IsNumber()
    @IsPositive()
    @IsDefined()
    minShipping:number

    @IsNumber()
    priority:number

    @IsString()
    @IsOptional()
    descripption?:string
}
