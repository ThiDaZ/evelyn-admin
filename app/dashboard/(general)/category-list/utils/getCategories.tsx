import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { z } from "zod";
import { categorySchema } from "@/data/category-list/schema";
import { toast } from "sonner";

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categoriesData = querySnapshot.docs.map(doc => ({
      id:doc.id,
      ...doc.data(),
    }));
    const brandTypeSchema = z.array(categorySchema).parse(categoriesData);
    // console.log(brandTypeSchema);
    return brandTypeSchema;
  } catch (e) {
    console.log(e);
    toast.error("Error fetching categories data");
    return [];
  }
};
