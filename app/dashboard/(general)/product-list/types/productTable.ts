import type { Product } from "./product"

export type ProductTableData = Pick<Product, "productID" | "name" | "price" | "stock" | "rating"> & { image: string }

