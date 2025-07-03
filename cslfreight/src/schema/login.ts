import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    }),
    password: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30)
})

export const RegisterSchema = z.object({
    shippingMark: z.string().min(2, {
        message: "Must be a valid Shipping Mark."
    }),
    email: z.string().email({
        message: "Email must be a valid email."
    }),
    phone: z.string({
        message: "Must be a valid phone."
    }),
    password: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30),
    confirmPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30)
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ['confirmPassword']
      });
    }
  });

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
