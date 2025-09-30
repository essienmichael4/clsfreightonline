import { ClientResponseDto, UserResponseDto } from "src/user/dto/user-response.dto";
import { Status } from "../entities/invoice.entity";
import { PackageResponse } from "src/package/dto/package-response.dto";

export class InvoiceResponseDto {
    id: number;
    invoiceId: string
    invoiceNumber: string
    clientName: string
    total: number
    totalCbm: number
    totalQty: number
    status: Status
    createdBy: UserResponseDto
    client: ClientResponseDto
    companyName: string
    eta: Date
    issuedDate: Date
    packages: PackageResponse[]
    createdAt: Date
    updatedAt: Date

    constructor(partial:Partial<InvoiceResponseDto>){
        Object.assign(this, partial)
    }
}
