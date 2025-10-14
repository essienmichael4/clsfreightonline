import { z } from "zod";
import { optionalString } from "./package";

export const VideoSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be a proper title."
    }).max(30).optional(),
    description: optionalString(
        z.string().min(1, {
        message: "Must be a valid description.",
        })
    ),
    premiere: z.union([
        z.literal("Public"),
        z.literal("Private"),
        z.literal("Unlisted"),
        z.literal("Scheduled")
    ])
})

export type VideoSchemaType = z.infer<typeof VideoSchema>
