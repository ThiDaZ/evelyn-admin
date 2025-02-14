import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { z } from "zod";
import { brandSchema } from "@/data/brand-list/schema";
import { toast } from "sonner";

export const getBrands = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "brands"));
    const brandsData = querySnapshot.docs.map(doc => ({
      id:doc.id,
      ...doc.data(),
    }));
    const brandTypeSchema = z.array(brandSchema).parse(brandsData);
    // console.log(brandTypeSchema);
    return brandTypeSchema;
  } catch (e) {
    console.log(e);
    toast.error("Error fetching brands data");
    return [];
  }
};
