import { collection, getDoc, getDocs, doc,  } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { z } from "zod";
import { productSchema } from "@/data/product-list/schema";
import { toast } from "sonner";

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const querySnapshot3 = await getDocs(collection(db, "category"));
    const productsData = [];

    // Step 2: Iterate through each product
    for (const productDoc of querySnapshot.docs) {
      const product = productDoc.data();
      const brandID = product.brandID; // Get the brandID from product data
      console.log(product)
      console.log(brandID)
      // Step 3: Fetch the corresponding brand document using the brandID
      const brandDocRef = doc(db, "brands", brandID);
      const brandDoc = await getDoc(brandDocRef);
      
      let brandName = "";
      if (brandDoc.exists()) {
        // Step 4: If the brand exists, get the brandName
        brandName = brandDoc.data().brandName;
      }

      // Step 5: Replace the brandID with the brandName in the product data
      productsData.push({
        ...product,
        brandName, // Add the brandName to the product object
      });
    }

    // Step 6: Validate the products data with your schema
    // const productTypeSchema = z.array(productSchema).parse(productsData);

    console.log("Updated Products with Brand Names:", productsData);
    const productTypeSchema = z.array(productSchema).parse(productsData);
    console.log(productsData);
    return productTypeSchema;
  } catch (e) {
    console.log(e);
    toast.error("Error fetching products data");
    return [];
  }
};
