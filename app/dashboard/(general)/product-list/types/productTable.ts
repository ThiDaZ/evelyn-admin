import type { Product } from "./product"

export type ProductTableData = Pick<Product, "id" | "name" | "price" | "stock" | "rating"> & { image: string }

