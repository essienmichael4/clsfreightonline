import { z } from "zod";

export const EditClientSchema = z.object({
    shippingMark: z.string().min(2, {
        message: "Must be a valid Shipping Mark."
    }),
    location: z.string().optional().or(z.literal('')),
    phone: z.string({
        message: "Must be a valid phone."
    }),
})

export const EditClientApprovalSchema = z.object({
    approvalStatus: z.union([z.literal("APPROVED"), z.literal("REJECTED"), z.literal("PENDING")])    
})

export type EditClientSchemaType = z.infer<typeof EditClientSchema>
export type EditClientApprovalSchemaType = z.infer<typeof EditClientApprovalSchema>
