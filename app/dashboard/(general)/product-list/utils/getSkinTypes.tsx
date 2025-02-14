import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { z } from "zod";
import { skinTypeSchema } from "@/data/skinType-list/schema";
import { toast } from "sonner";

export const getSkinType = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "skinTypes"));
    const skinTypesData = querySnapshot.docs.map(doc => ({
      id:doc.id,
      ...doc.data(),
    }));
    const skinTypeTypeSchema = z.array(skinTypeSchema).parse(skinTypesData);
    // console.log(skinTypeTypeSchema);
    return skinTypeTypeSchema;
  } catch (e) {
    console.log(e);
    toast.error("Error fetching skin types data");
    return [];
  }
};
