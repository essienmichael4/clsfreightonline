import { z } from "zod";

export const MembershipTierSchema = z.object({
    name: z.string().min(2, {
        message: "Must be a valid memebership Tier."
    }),
    priority: z.coerce.number().positive().min(1),
    minShipping: z.coerce.number().positive().min(0),
    description: z.string().optional().or(z.literal('')),
})

export type MembershipTierSchemaType = z.infer<typeof MembershipTierSchema>
