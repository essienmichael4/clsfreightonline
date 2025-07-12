import { Exclude } from "class-transformer"

class ClientDetailsDto {
    id: number
    dob?:Date
    location?:string
    nextOfKin?:string
    nextOfKinPhone?:string
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

    constructor(partial:Partial<ClientResponseDto>){
        Object.assign(this, partial)
    }
}
