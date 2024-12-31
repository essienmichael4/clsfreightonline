import { Dispatch, SetStateAction } from "react"

export type AuthType = {
    user:{
        name: string,
        email: string
    },
    backendTokens: {
        accessToken: string,
        refreshToken: string
    }
}

export type AuthContextType = {
    auth: AuthType | undefined,
    setAuth: Dispatch<SetStateAction<AuthType | undefined>>;
}

export type Package = {
    id:number,
    trackingNumber:string,
    cbm:string,
    customer: string
    quantity:number,
    loaded:string,
    received:string,
    vessel:string,
    status:string,
    createdAt:string,
    eta: string,
    package:string
}
