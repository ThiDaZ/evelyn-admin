export interface Product {
    id: string
    name: string
    brandID: string
    categoryID: string
    price: number
    stock: number
    description: string
    ingredients: string[]
    skinTypes: string[]
    rating: number
    reviewCount: number
    images: string[]
    dupes: string[]
    createdAt: Date
    updatedAt: Date
  }
  
  export type ProductFormData = Omit<Product, "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt">
  
  export interface Brand {
    id: string
    name: string
  }
  
  export interface Category {
    id: string
    name: string
  }
  
  