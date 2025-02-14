import { dupesSchema } from "@/data/product-list/schema";
import { db } from "@/lib/firebase/config";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { z } from "zod";

export const getDupes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const dupesData = querySnapshot.docs.map((doc) => {
        const productID = doc.id
        const data = doc.data()
        const name = data.name;
        return {productID, name};
    })
    const dupesTypeSchema = z.array(dupesSchema).parse(dupesData);
    return dupesTypeSchema;
  } catch (e) {
    console.log(e);
  }
};
