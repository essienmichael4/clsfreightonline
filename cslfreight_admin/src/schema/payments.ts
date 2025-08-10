import { z } from "zod";

export const PaymentSchema = z.object({
    paidShippingRate: z.coerce.number().positive().min(0),
    reference: z.string().optional().or(z.literal('')),
    paymentMethod: z.string().optional().or(z.literal('')),
})

export type PaymentSchemaType = z.infer<typeof PaymentSchema>
