import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Status } from "../entities/invoice.entity";

export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    shippingMark: string

    @IsString()
    @IsNotEmpty()
    clientName: string

    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsNumber()
    totalQty: number

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    totalCbm?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    total?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    rate?: number;

    @IsString()
    @IsOptional()
    issued:string

    @IsString()
    @IsOptional()
    eta:string

    @IsString()
    @IsOptional()
    invoiceId:string

    @IsString()
    @IsOptional()
    status:Status

    @IsArray()
    @IsInt({ each: true }) // package IDs
    @IsOptional()
    packages?: number[];
}
