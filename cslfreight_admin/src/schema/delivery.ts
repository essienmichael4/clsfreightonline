import { z } from "zod";

export const DeliveryStatusSchema = z.object({
    status:z.union([
        z.literal("Pending"),
        z.literal("Completed")
    ])
})

export const PickupReadyStatusSchema = z.object({
    pickup:z.union([
        z.literal("True"),
        z.literal("False")
    ])
})

export const DeliveryConfirmationSchema = z.object({
    confirmation: z.union([
        z.literal("Pending"),
        z.literal("Confirmed"),
        z.literal("Declined")
    ])
})

export type DeliveryConfirmationSchemaType = z.infer<typeof DeliveryConfirmationSchema>
export type DeliveryStatusSchemaType = z.infer<typeof DeliveryStatusSchema>
export type PickupReadyStatusSchemaType = z.infer<typeof PickupReadyStatusSchema>