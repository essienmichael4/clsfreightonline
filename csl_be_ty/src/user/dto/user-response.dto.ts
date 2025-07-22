import { Exclude } from "class-transformer"

class ClientDetailsDto {
    id: number
    dob?:Date
    location?:string
    nextOfKin?:string
    nextOfKinPhone?:string
}

export class MembershipTierDto {
    id: number;
    name: string;
    description?: string;
    priority: number;
}

export class AttachmentResponseDto {
    id: number
    name: string
    imageUrl?:string
    public createdAt:Date 
    public updatedAt:Date 

    constructor(partial:Partial<AttachmentResponseDto>){
        Object.assign(this, partial)
    }
}

export class UserResponseDto {
    public id:number 
    public name:string
    public email:string
    public createdAt:Date 
    public updatedAt:Date 
    public role:string 
    @Exclude()
    public password: string

    constructor(partial:Partial<UserResponseDto>){
        Object.assign(this, partial)
    }
}

export class ClientResponseDto {
    public id:number 
    public name?:string
    public shippingMark:string
    public email:string
    public createdAt:Date 
    public updatedAt:Date 
    public phone?:string 
    public isDeleted: string;

    @Exclude()
    public password: string

    clientsDetails?:ClientDetailsDto
    membershipTier?:MembershipTierDto
    attachments?:AttachmentResponseDto[]

    constructor(partial:Partial<ClientResponseDto>){
        Object.assign(this, partial)
    }
}
