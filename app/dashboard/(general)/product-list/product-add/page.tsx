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
import { z } from "zod";
import { getBrands } from "../../brand-list/utils/getBrands";
import { brandSchema } from "@/data/brand-list/schema";
import { getCategories } from "../../category-list/utils/getCategories";
import { categorySchema } from "@/data/category-list/schema";
import { skinTypeSchema } from "@/data/skinType-list/schema";
import { getSkinType } from "../utils/getSkinTypes";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getFile, uploadFile } from "@/lib/firebase/storage";
import { toast } from "sonner";
import { dupesSchema } from "@/data/product-list/schema";
import { getDupes } from "../utils/getDupes";

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [category, setCategory] = useState<z.infer<typeof categorySchema>[]>([]);
  const [dupes, setDupes] = useState<z.infer<typeof dupesSchema>[]>([]);

  const fetchCategories = async () => {
    const categoriesData = await getCategories();
    setCategory(categoriesData);
  };

  const [brands, setBrands] = useState<z.infer<typeof brandSchema>[]>([]);
  const fetchBrands = async () => {
    const brandsData = await getBrands();
    setBrands(brandsData);
  };

  const [skinType, setSkinType] = useState<z.infer<typeof skinTypeSchema>[]>([]);
  const fetchSkinType = async () => {
    const skinTypeData = await getSkinType();
    setSkinType(skinTypeData);
  };

  const fetchDupes = async()=>{
    const dupesData = await getDupes();
    if (dupesData) {
      setDupes(dupesData);
    }
  }

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSkinType();
    fetchDupes();
  }, []);

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    let uploadedImageUrl = [];
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: data.name,
        price: data.price,
        rating: "0.0",
        reviewCount: "0",
        skinTypes: data.skinTypes,
        stock: data.stock,
        brandID: data.brandID,
        categoryID: data.categoryID,
        description: data.description,
        dupes: data.dupes,
        ingredients: data.ingredients,
        createdAt: serverTimestamp(),
        // image: data.images
      });
      console.log("product added with ID:", docRef.id);
  
      if (docRef.id !== "") {
        if (data.images && data.images.length > 0) {
          try {
            const folder = "products/" + docRef.id + "/";
            let x = 1;
  
            for (let image of data.images) {
              if (image) {
                // Skip upload if it's already a URL string
                if (typeof image === 'string') {
                  uploadedImageUrl.push(image);
                  continue;
                }
  
                let fileToUpload: File;
                if (image instanceof Blob) {
                  fileToUpload = new File([image], `${docRef.id}_${x}.jpg`, { type: image.type });
                } else {
                  fileToUpload = image as File; // Type assertion since we know it's a File at this point
                }
  
                const imageName = docRef.id + x;
                console.log("File uploading to:", fileToUpload);
  
                const filePath = await uploadFile(fileToUpload, imageName, folder);
                console.log("File uploaded to:", filePath);
                const url = await getFile(filePath);
                uploadedImageUrl.push(url);
                x++;
              } else {
                console.warn("Skipping undefined or invalid image");
              }
            }
  
            if (uploadedImageUrl.length > 0) {
              await updateDoc(doc(db, "products", docRef.id), {
                images: uploadedImageUrl,
              });
              console.log("Files uploaded successfully");
              toast.success("New product added successfully");
              router.push("/dashboard/product-list/");
            } else {
              toast.warning("No valid images to upload");
            }
          } catch (e) {
            console.error("Error uploading file:", e);
            toast.warning("Error uploading file");
          }
        } else {
          console.log("No images provided");
        }
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  
    setIsLoading(false);
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
          categories={category}
          allProducts={allProducts}
          skinType={skinType}
          dupes={dupes}
        />
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

//
