export type AuthType = {
    shippingMark: string,
    backendTokens?: {
        accessToken?: string,
        refreshToken?: string
    },
    email: string,
    name?: string,
    phone?: string,
    location?: string,
    id: number | undefined,
    membershipTier?: MembershipTier
}

export type PackageTypeAndRate = {
    id: number,
    description: string,
    rate: number,
    cedisRate: number,
    createdAt: string,
    updatedAt: string,
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

export type Package = {
    id: number,
    trackingNumber: string,
    cbm: string,
    weight?: string,
    email: string,
    phone?: string,
    customer: string
    quantity: number,
    loaded?: string,
    received?: string,
    vessel?: string,
    status: string,
    createdAt: string,
    eta?: string,
    departure?: string,
    package: string,
    dollarEstimate?: string
    cedisEstimate?: string
    description?: string
    packageType?: PackageTypeAndRate
}

export type AddressType = {
    id: number,
    name: string,
    contact: string,
    mobile: string,
    address: string
}

export type Payment = {
    id: number,
    client?: Client,
    paidShippingRate: number,
    reference: string,
    paymentMethod: string
}

export type Attachment = {
    id: number
    name: string
    imageUrl: string
    createdAt?: string,
    updatedAt?: string,
}

export type Client = {
    id: number,
    name?: string,
    email: string,
    phone?: string,
    shippingMark: string,
    clientDetails?: Details,
    membershipTier?: MembershipTier,
    attachments?: Attachment[]
}

export type MembershipTier = {
    id: number;
    name: string;
    description?: string;
    priority: number;
}

export type Details = {
    id: number,
    dob?: string,
    location: string,
    nextOfKin: string,
    nextOfKinPhone: string
}

export type Data = {
    data: Client[] | Package[] | Payment[] | Delivery[],
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

export type Delivery = {
    id: number,
    phone: string,
    location: string,
    loaded: string,
    deliveryType: string,
    pickupBy: string,
    thirdPartyName?: string,
    thirdPartyPhone?: string,
    status: "Completed" | "Pending",
    isConfirmed: "Confirmed" | "Pending" | "Declined",
    isPickupReady: "True" | "False",
    createdAt: string,
    updatedAt?: string,
    client: Pick<Client, "id" | "name" | "shippingMark">
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

