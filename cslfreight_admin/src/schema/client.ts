import { z } from "zod";

export const EditClientSchema = z.object({
    shippingMark: z.string().min(2, {
        message: "Must be a valid Shipping Mark."
    }),
    phone: z.string({
        message: "Must be a valid phone."
    }),
})

export type EditClientSchemaType = z.infer<typeof EditClientSchema>
