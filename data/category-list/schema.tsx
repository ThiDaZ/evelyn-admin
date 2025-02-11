import { z } from "zod"

export const categorySchema = z.object({
  id: z.string(),
  categoryName: z.string(),
  description: z.string(),
})

export type Category = z.infer<typeof categorySchema>