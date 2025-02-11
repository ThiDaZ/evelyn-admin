import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@/lib/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSessionUserEmail = (): string | null => {
  const user = auth.currentUser;
  return user ? user.email : null;
};

export const getSessionUserDetails = () => {
  const user = auth.currentUser;
  const userId = user?.uid;

  const getUserById = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        console.log("User data:", userDoc.data());
        return userDoc.data();
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return getUserById;
};
