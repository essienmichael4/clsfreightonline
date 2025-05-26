import { Exclude } from "class-transformer"

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