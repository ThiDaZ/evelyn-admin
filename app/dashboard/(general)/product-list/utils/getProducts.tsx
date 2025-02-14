import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { z } from "zod";
import { productSchema } from "@/data/product-list/schema";
import { toast } from "sonner";

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = [];

    for (const productDoc of querySnapshot.docs) {
      const product = productDoc.data();
      const productID = productDoc.id;
      const brandID = product.brandID;
      const categoryID = product.categoryID;

      const brandDocRef = doc(db, "brands", brandID);
      const brandDoc = await getDoc(brandDocRef);

      const categoryDocRef = doc(db, "categories", categoryID);
      const categoryDoc = await getDoc(categoryDocRef);

      let brandName = "";
      if (brandDoc.exists()) {
        brandName = brandDoc.data().brandName;
      }
      let categoryName = "";
      if (categoryDoc.exists()) {
        categoryName = categoryDoc.data().categoryName;
      }

      productsData.push({
        ...product,
        productID,
        brandName,
        categoryName,
      });
    }

    // console.log("Updated Products with Brand Names:", productsData);
    const productTypeSchema = z.array(productSchema).parse(productsData);
    // console.log(productsData);
    return productTypeSchema;
  } catch (e) {
    console.log(e);
    toast.error("Error fetching products data");
    return [];
  }
};

export const getSingleProduct = async (productID: string) => {
  // console.log("productID", productID);
  try {
    const productDocRef = doc(db, "products", productID);
    const productDoc = await getDoc(productDocRef);

    if (!productDoc.exists()) {
      console.log("Product not found");
      toast.error("Product not found");
      return null;
    }

    const product = productDoc.data();
    const brandID = product.brandID;
    const categoryID = product.categoryID;

    let brandName = "";
    if (brandID) {
      const brandDocRef = doc(db, "brands", brandID);
      const brandDoc = await getDoc(brandDocRef);
      if (brandDoc.exists()) {
        brandName = brandDoc.data().brandName;
      }
    }

    let categoryName = "";
    if (categoryID) {
      const categoryDocRef = doc(db, "categories", categoryID);
      const categoryDoc = await getDoc(categoryDocRef);
      if (categoryDoc.exists()) {
        categoryName = categoryDoc.data().categoryName;
      }
    }

    const fetchProduct = {
      ...product,
      productID,
      brandName,
      categoryName,
    };

    const validatedProduct = productSchema.parse(fetchProduct);

    console.log("fetch Product:", validatedProduct);
    return validatedProduct;
  } catch (e) {
    console.error("Error fetching product:", e);
    toast.error("Error fetching product data");
    return null;
  }
};
