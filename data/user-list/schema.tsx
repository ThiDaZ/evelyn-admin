import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  mobile: z.string(),
  email: z.string(),
  role: z.string(),
  fullName: z.string(),
  status: z.string(),
})

export type Users = z.infer<typeof userSchema>