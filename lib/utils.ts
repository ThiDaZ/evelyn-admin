import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "@/lib/firebase/config";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSessionUserEmail = (): string | null => {
  const user = auth.currentUser;
  return user ? user.email : null;
};
