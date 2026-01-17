import { z } from "zod";

export const DepartmentSchema = z.object({
    name: z.string({
        message: "Must be a valid department name."
    }),
     code: z.coerce.number().positive().min(0),
    description: z.string().optional().or(z.literal('')),
})

export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>
