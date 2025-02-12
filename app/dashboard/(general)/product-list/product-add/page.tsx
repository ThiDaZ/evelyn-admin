"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../components/ProductForm";
// import { addProduct, getBrands, getCategories, getProducts } from "../../lib/api"
import type {
  ProductFormData,
  Brand,
  Category,
  Product,
} from "../types/product";

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const router = useRouter();

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const [brandsData, categoriesData, productsData] = await Promise.all([
  //         getBrands(),
  //         getCategories(),
  //         getProducts(),
  //       ])
  //       setBrands(brandsData)
  //       setCategories(categoriesData)
  //       setAllProducts(productsData)
  //     }
  //     fetchData()
  //   }, [])

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    // try {
    //   await addProduct(data)
    //   router.push("/")
    // } catch (error) {
    //   console.error("Failed to add product:", error)
    //   // Handle error (e.g., show error message to user)
    // } finally {
    //   setIsLoading(false)
    // }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex  items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">
            Fill product details to save new product
          </p>
        </div>
      </div>
      <div className="py-10">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          brands={brands}
          categories={categories}
          allProducts={allProducts}
        />
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

//
