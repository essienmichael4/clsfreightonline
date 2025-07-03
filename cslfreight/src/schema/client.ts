import { z } from "zod";

export const UserPasswordUpdateSchema = z.object({
    oldPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
    newPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
    confirmPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
}).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
});

export const EditClientSchema = z.object({
    shippingMark: z.string().min(2, {
        message: "Must be a valid Shipping Mark."
    }),
    phone: z.string({
        message: "Must be a valid phone."
    }),
})

export const EditClientInfoSchema = z.object({
    location: z.string().min(2, {
        message: "Must be a valid Shipping Mark."
    }),
    dob: z.coerce.date().optional(),
    nextOfKinPhone: z.string({
        message: "Must be a valid phone."
    }),
    nextOfKin: z.string().min(2, {
        message: "Must be a valid Shipping Mark."
    }),
})

export type EditClientSchemaType = z.infer<typeof EditClientSchema>
export type EditClientInfoSchemaType = z.infer<typeof EditClientInfoSchema>
export type UserPasswordUpdateSchemaType = z.infer<typeof UserPasswordUpdateSchema>
