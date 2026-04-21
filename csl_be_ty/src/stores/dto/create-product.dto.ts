import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from "class-validator";
import { ProductStatus } from "../entities/product.entity";

export class CreateProductDto {
    @ApiProperty({
        description: "Product name",
        example: "Electric iron",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        description: "price",
        example: 1500,
        required: true
    })
    @IsDefined()
    @IsNumber()
    price:number 

     @ApiProperty({
        description: "desription",
        example: "This is a nice product.",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    description:string 

    @ApiProperty({
            description: "Status",
            example: ProductStatus.DRAFT,
            required: false
        })
    @IsEnum(ProductStatus)
    @IsOptional()
    status?:ProductStatus
}
