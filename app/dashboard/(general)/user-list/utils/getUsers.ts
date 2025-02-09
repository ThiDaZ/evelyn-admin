import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { z } from "zod";
import { userSchema } from "@/data/user-list/schema";
import { toast } from "sonner";

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const fullName = `${data.firstName} ${data.lastName}`;
      return { ...data, fullName };
    });
    const userTypeSchema = z.array(userSchema).parse(usersData);
    return userTypeSchema;
  } catch (e) {
    console.log(e);
    toast.error("Error fetching users data");
    return [];
  }
};
