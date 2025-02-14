"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../components/ProductForm";
import type { ProductFormData, Product } from "../../types/product";
import { z } from "zod";
import { getBrands } from "../../../brand-list/utils/getBrands";
import { brandSchema } from "@/data/brand-list/schema";
import { getCategories } from "../../../category-list/utils/getCategories";
import { categorySchema } from "@/data/category-list/schema";
import { skinTypeSchema } from "@/data/skinType-list/schema";
import { getSkinType } from "../../utils/getSkinTypes";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getFile, uploadFile } from "@/lib/firebase/storage";
import { toast } from "sonner";
import { dupesSchema, productSchema } from "@/data/product-list/schema";
import { getDupes } from "../../utils/getDupes";
import { getSingleProduct } from "../../utils/getProducts";

export default function EditProduct({
  params,
}: {
  params: Promise<{ pid: string }>
}) {
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [category, setCategory] = useState<z.infer<typeof categorySchema>[]>(
    []
  );
  const [dupes, setDupes] = useState<z.infer<typeof dupesSchema>[]>([]);
  const [product, setProducts] = useState<z.infer<typeof productSchema>[]>([]);

  const getProduct = async () => {
    const productData = await getSingleProduct(resolvedParams.pid);
    if (productData) {
      setProducts([productData]);
    }
  };

  useEffect(() => {
    console.log(product);
  }, [product]);

  const fetchCategories = async () => {
    const categoriesData = await getCategories();
    setCategory(categoriesData);
  };

  const [brands, setBrands] = useState<z.infer<typeof brandSchema>[]>([]);
  const fetchBrands = async () => {
    const brandsData = await getBrands();
    setBrands(brandsData);
  };

  const [skinType, setSkinType] = useState<z.infer<typeof skinTypeSchema>[]>(
    []
  );
  const fetchSkinType = async () => {
    const skinTypeData = await getSkinType();
    setSkinType(skinTypeData);
  };

  const fetchDupes = async () => {
    const dupesData = await getDupes();
    if (dupesData) {
      setDupes(dupesData);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSkinType();
    fetchDupes();
    getProduct();
  }, []);

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    let uploadedImageUrl: string[] = [];

    try {
      if (!resolvedParams.pid) {
        toast.error("Invalid product ID");
        return;
      }

      // Handle images if provided
      if (data.images && data.images.length > 0) {
        const folder = `products/${resolvedParams.pid}/`;
        let x = 1;

        for (const image of data.images) {
          if (!image) continue;

          if (typeof image === "string") {
            uploadedImageUrl.push(image);
            continue;
          }

          try {
            let fileToUpload: File;
            if (image instanceof Blob) {
              fileToUpload = new File([image], `${resolvedParams.pid}_${x}.jpg`, {
                type: image.type,
              });
            } else {
              fileToUpload = image;
            }

            const imageName = `${resolvedParams.pid}_${x}`;
            const filePath = await uploadFile(fileToUpload, imageName, folder);
            const url = await getFile(filePath);
            uploadedImageUrl.push(url);
            x++;
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(`Failed to upload image ${x}`);
          }
        }
      }

      // Update product document
      const updateData = {
        name: data.name,
        price: data.price,
        skinTypes: data.skinTypes,
        stock: data.stock,
        brandID: data.brandID,
        categoryID: data.categoryID,
        description: data.description,
        dupes: data.dupes,
        ingredients: data.ingredients,
        ...(uploadedImageUrl.length > 0 && { images: uploadedImageUrl }),
      };

      await updateDoc(doc(db, "products", resolvedParams.pid), updateData);
      toast.success("Product updated successfully");
      router.push("/dashboard/product-list/");

    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">Update product details</p>
        </div>
      </div>
      <div className="py-10">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          brands={brands}
          categories={category}
          allProducts={allProducts}
          skinType={skinType}
          dupes={dupes}
          initialData={product[0]}
        />
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

//
