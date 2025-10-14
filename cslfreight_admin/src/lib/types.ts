import { Status } from "@/pages/Invoices/Create"
import type { Dispatch, SetStateAction } from "react"

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

export type AnnouncementType = {
    title?:string,
    body:string,
    show: string
}

export type MarqueAnnouncementType = {
    id: number,
    announcement:string,
    isShown: string
}

export type AddressType = {
    id: number,
    name:string,
    contact:string,
    mobile: string,
    address: string
}

export type Attachment = {
    id: number
    name: string
    imageUrl:string
    createdAt?: string,
    updatedAt?:string,
}

export type BankType = {
    id: number,
    name:string,
    accountName: string,
    accountNumber: string,
    branch: string
}

export type Client = {
    id: number,
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
    membershipTier?:MembershipTier,
    payments: Payment
}

export type Data = {
    data: Client[] | Package[] | Payment[] | Invoice[] | Delivery[],
    meta: Meta
}

export type Details = {
    id: number,
    dob?: string,
    location: string,
    nextOfKin: string,
    nextOfKinPhone: string
}

export type Delivery = {
    id: number,
    phone: string,
    location: string,
    loaded: string,
    deliveryType: string,
    pickupBy: string,
    thirdPartyName?: string,
    thirdPartyPhone?: string,
    status: string,
    isConfirmed: string,
    createdAt: string,
    updatedAt?: string,
    client: Pick<Client, "id" | "name" | "shippingMark">
}

export type HelplineType = {
    id: number,
    phone:string,
}

export type Invoice = {
    id: number,
    invoiceId: string,
    invoiceNumber: string,
    clientName: string,
    total: number,
    totalCbm: number,
    totalQty: number,
    status: Status,
    createdBy: User,
    client: Client,
    companyName: string,
    eta: string,
    issuedDate: string,
    packages: Package[],
    createdAt: string,
    updatedAt: string,
    rate: number
}

export type InvoiceAddressType = {
    id: number,
    name:string,
    addressLine: string,
    streetAddress: string,
    box: string,
    city: string,
    state: string
}

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
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

export type Payment = {
    id: number,
    client?: Client,
    user?: User,
    paidShippingRate: number,
    reference: string,
    paymentMethod: string
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

export type WarehouseType = {
    id: number,
    name:string,
    description: string,
}
