import { Dispatch, SetStateAction } from "react"

export type AuthType = {
    user:{
        name: string,
        email: string,
        role?: string,
        id: number | undefined
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

export type Attachment = {
    id: number
    name: string
    imageUrl:string
    createdAt?: string,
    updatedAt?:string,
}

export type Client = {
    id: number | null,
    name?: string,
    email: string,
    phone?: string,
    shippingMark: string,
    createdAt?: string,
    updatedAt?:string,
    packages: Package[]
    clientDetails?:Details,
    totalShippingRate?: number,
    attachments?: Attachment[],
    membershipTier?:MembershipTier
}

export type Data = {
    data: Client[] | Package[],
    meta: Meta
}

export type Meta = {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

export type MembershipTier = {
    id: number;
    name: string;
    description?: string;
    priority: number;
    minShipping?: number
    clientCount?: number
}

export type Details = {
    id: number,
    dob?: string,
    location: string,
    nextOfKin: string,
    nextOfKinPhone: string
}
export type Package = {
    id:number,
    trackingNumber:string,
    cbm:string,
    email:string,
    phone?: string,
    customer: string
    quantity:number,
    loaded?:string,
    received?:string,
    vessel?:string,
    status:string,
    createdAt:string,
    eta?: string,
    departure?: string,
    package:string
    description?:string,
    client?: Client,
    packageType?:PackageTypeAndRate
}

export type PackageTypeAndRate = {
    id: number,
    description:string,
    rate:number,
    cedisRate:number,
    createdAt:string,
    updatedAt:string,
}

export type User = {
    id: number | null,
    name: string,
    email: string,
    role?: string,
    createdAt?: string,
    updatedAt?:string,
}

export type AnnouncementType = {
    title?:string,
    body:string,
    show: string
}

export type AddressType = {
    id: number,
    name:string,
    contact:string,
    mobile: string,
    address: string
}

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
}
