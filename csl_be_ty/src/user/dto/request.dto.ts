import { IsNumber } from "class-validator"

export class PaginationDto {
    @IsNumber()
    pageIndex: number

    @IsNumber()
    pageSize: number
}
