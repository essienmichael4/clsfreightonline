import { z } from "zod";

export const AddWarehouseSchema = z.object({
    name: z.string().min(2, {
        message: "Title must be a proper title."
    }),
    description: z.string().min(2, {
        message: "This must be a proper description."
    })
})

export const AddBankSchema = z.object({
    name: z.string().min(2, {
        message: "Title must be a proper title."
    }),
    accountName: z.string().min(2, {
        message: "This must be a proper description."
    }),
    accountNumber: z.string().min(2, {
        message: "This must be a proper description."
    }),
    branch: z.string().min(2, {
        message: "This must be a proper description."
    })
})

export const AddHelplineSchema = z.object({
    phone: z.string().min(2, {
        message: "Title must be a proper phone number."
    })
})

export type AddWarehouseSchemaType = z.infer<typeof AddWarehouseSchema>
export type AddBankSchemaType = z.infer<typeof AddBankSchema>
export type AddHelplineSchemaType = z.infer<typeof AddHelplineSchema>
