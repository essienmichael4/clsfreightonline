import { Exclude } from "class-transformer"
import { MembershipTierDto } from "src/user/dto/user-response.dto"

export class UserAuthReponse{
    id:number 
    name:string
    email    :string
    createdAt:Date 
    updatedAt:Date 

    @Exclude()
    password:string

    constructor(partial:Partial<UserAuthReponse>){
        Object.assign(this, partial)
    }
}

export class ClientAuthReponse{
    id       :number 
    name     :string
    email    :string
    phone   ?:string
    shippingMark:string
    createdAt:Date 
    updatedAt:Date 

    membershipTier?:MembershipTierDto

    @Exclude()
    password:string

    constructor(partial:Partial<UserAuthReponse>){
        Object.assign(this, partial)
    }
}
