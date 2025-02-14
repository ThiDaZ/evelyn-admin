import { z } from "zod"

export const skinTypeSchema = z.object({
  id: z.string(),
  typeName: z.string(),
  recommendedIngredients: z.array(z.string()),
  description: z.string()
})

export type SkinType = z.infer<typeof skinTypeSchema>