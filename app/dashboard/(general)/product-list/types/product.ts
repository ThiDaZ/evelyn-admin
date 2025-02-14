export interface Product {
  id: string;
  productID: string;
  name: string;
  brandID: string;
  brandName: string,
  categoryID: string;
  categoryName: string;
  price: string;
  stock: string;
  description: string;
  ingredients: string[];
  skinTypes: string[];
  rating: string;
  reviewCount: string;
  images: (string | File)[];
  dupes: string[];
}

export type ProductFormData = Omit<
  Product,
  "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt"
>;

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
