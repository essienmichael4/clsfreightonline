export type AuthType = {
    shippingMark: string,
    email: string,
    id: number | undefined,
    membershipTier?: MembershipTier
    backendTokens: {
        accessToken: string,
        refreshToken: string
    }
}

export type Attachment = {
    id: number
    name: string
    imageUrl:string
    createdAt?: string,
    updatedAt?:string,
}

export type Client = {
    id: number,
    name?: string,
    email:string,
    phone?: string,
    shippingMark: string,
    clientDetails?:Details,
    membershipTier?:MembershipTier,
    attachments?: Attachment[]
}

export type Comment = {
    id: number,
    content?:string,
    client?: Client,
    user?: User,
    createdAt?: string,
    updatedAt?:string,
    replies?: Comment[],
    parentId?:string
}

export type User = {
    name: string,
    email?:string,
    createdAt?: string,
    updatedAt?:string,
}

export type Data = {
    data: Client[] | Package[] | Payment[],
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

export type MembershipTier = {
    id: number;
    name: string;
    description?: string;
    priority: number;
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
    package:string,
    dollarEstimate?: string
    cedisEstimate?: string
    description?:string
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

export type Payment = {
    id: number,
    client?: Client,
    paidShippingRate: number,
    reference: string,
    paymentMethod: string
}

export type AnnouncementType = {
    title?:number,
    body:string,
    show: string
}

export type MarqueAnnouncementType = {
    id?: number,
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

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
}

export type Stats = {
    estimated: {
        name: string,
        stat: number
    },
    packages: {
        name: string,
        stat: number
    },
    undelivered: {
        name: string,
        stat: number
    },
    delivered: {
        name: string,
        stat: number
    }
}

export type StoreProduct = {
    id: number;
    productId?: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    badge?: string;
    status?: string;
    imageUrls?: string[];
    attachments?: Attachment[];
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
    viewsCount?: number;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    userLiked?: boolean
    uploader?: Client
}
