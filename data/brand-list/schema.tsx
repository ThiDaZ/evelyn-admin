import { count } from "console"
import { create } from "domain"
import { z } from "zod"

export const brandSchema = z.object({
  brandName: z.string(),
  country: z.string(),
  createdAt: z.string(),
  logo: z.string(),
})

export type Brand = z.infer<typeof brandSchema>