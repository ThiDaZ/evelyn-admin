import { z } from "zod"

export const productSchema = z.object({
    productID: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.string(),  
    stock: z.string(),  
    rating: z.string(),  
    reviewCount: z.string(),  
    ingredients: z.array(z.string()),  
    brandID: z.string(), 
    brandName: z.string(),
    categoryID: z.string(),  
    categoryName: z.string(),
    dupes: z.array(z.string()),  
    skinTypes: z.array(z.string()),  
    images: z.array(z.string())
})

export const dupesSchema = z.object({
    productID: z.string(),
    name: z.string(),
})


export type Product = z.infer<typeof productSchema>
export type dupes = z.infer<typeof dupesSchema>