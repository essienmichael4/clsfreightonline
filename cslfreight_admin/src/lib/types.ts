import { Status } from "@/pages/Invoices/Create"
import type { Dispatch, SetStateAction } from "react"

export type AuthType = {
    user:{
        name: string,
        email: string,
        role?: string,
        id: number | undefined,
        departments: Department[]
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
    approvalStatus?:string,
    packages: Package[]
    clientDetails?:Details,
    totalShippingRate?: number,
    attachments?: Attachment[],
    membershipTier?:MembershipTier,
    payments: Payment
}

export type Comment = {
    id: number,
    content?:string,
    client?: Client,
    user?: User,
    createdAt?: string,
    updatedAt?:string,
    replies?: Comment[],
    parentId?: string
}

export type Data = {
    data: Client[] | Package[] | Payment[] | Invoice[] | Delivery[] | Video[]
    meta: Meta
}

export type Department = {
    id: number,
    name: string,
    code: string,
    description?: string,
    createdAt: string,
    updatedAt: string,
    admins?: User[]
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
    status: "Completed" | "Pending" ,
    isConfirmed: "Confirmed" | "Pending" | "Declined",
    isPickupReady: "True" | "False",
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
    weight?:string,
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
    paymentMethod: string,
    datePaid?: string
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
    departments?: Department[]
}

export type Video = {
    id: number,
    title?: string,
    description?: string,
    thumbnail?: string,
    key?: string,
    premiere?: string,
    isPublished?: string,
    likesCount?: number,
    viewsCount?: number,
    createdAt: string,
    updatedAt: string,
    tags?: string[],
    userLiked?: boolean,
    uploader?: User,
    comments?: Comment[]
}

export type WarehouseType = {
    id: number,
    name:string,
    description: string,
}
