import { count } from "console"
import { create } from "domain"
import { z } from "zod"

export const brandSchema = z.object({
  id: z.string(),
  brandName: z.string(),
  country: z.string(),
  logo: z.string(),  
})

export type Brand = z.infer<typeof brandSchema>