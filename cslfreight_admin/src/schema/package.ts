import { z } from "zod";

export const PackageSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    }).optional(),
    phone: z.string().min(9, {
        message: "Must be a valid phone number."
    }).optional(),
    trackingNumber: z.string({
        message: "Must be a valid tracking number."
    }),
    package: z.string({
        message: "Must be a valid package number."
    }).optional(),
    vessel: z.string().min(2, {
        message: "Must be a valid vessel name."
    }).optional(),
    customer: z.string().min(2, {
        message: "Must be a valid name."
    }),
    cbm: z.coerce.number().positive().min(0.1),
    quantity: z.coerce.number().positive().min(0),
    loaded: z.coerce.date(),
    received: z.coerce.date(),
    eta: z.coerce.date(),
    status:z.union([
        z.literal("ON_HOLD"),
        z.literal("EN_ROUTE"),
        z.literal("ARRIVED"),
        z.literal("DELIVERED")
    ])
})

export const EditPackageSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    }).optional(),
    phone: z.string().min(9, {
        message: "Must be a valid phone number."
    }).optional(),
    trackingNumber: z.string({
        message: "Must be a valid tracking number."
    }).optional(),
    package: z.string({
        message: "Must be a valid package number."
    }).optional(),
    vessel: z.string().min(2, {
        message: "Must be a valid vessel name."
    }).optional(),
    customer: z.string().min(2, {
        message: "Must be a valid name."
    }).optional(),
    cbm: z.coerce.number().positive().min(0.1).optional(),
    quantity: z.coerce.number().positive().min(0).optional(),
    loaded: z.coerce.date().optional(),
    received: z.coerce.date().optional(),
    eta: z.coerce.date().optional()
})

export type PackageSchemaType = z.infer<typeof PackageSchema>
export type EditPackageSchemaType = z.infer<typeof EditPackageSchema>
