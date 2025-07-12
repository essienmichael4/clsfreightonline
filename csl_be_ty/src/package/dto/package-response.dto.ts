import { ClientResponseDto, UserResponseDto } from "src/user/dto/user-response.dto";

class PackageType {
    id:number
    description: string;
    createdAt: Date;
    rate: number
    cedisRate: number
}

class PackageEdit {
    id:number
    description: string;
    updatedAt: Date;
    createdAt: Date;
}

export class PackageResponse {
    id:number
    package: string
    trackingNumber: string
    customer: string
    cbm: number;
    email: string;
    phone: string;
    description: string;
    quantity: number;
    vessel: string;
    departure: Date;
    loaded: Date;
    eta: Date;
    received: Date;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: string;
    status: string;
    dollarEstimate?: string
    cedisEstimate?: string
    
    packageType?: PackageType
    user?: UserResponseDto
    client?: ClientResponseDto

    constructor(partial:Partial<PackageResponse>){
        Object.assign(this, partial)
    }
}
