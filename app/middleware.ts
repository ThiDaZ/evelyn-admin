import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Middleware function to check if the user is authenticated
export async function middleware(request: Request) {
  const user = await new Promise<{ uid: string } | null>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user ? { uid: user.uid } : null);
    });
  });

  // Redirect to login if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if the user has an "admin" role (you can expand this logic as needed)
  const userDoc = await fetchUserFromDB(user.uid);
  if (userDoc?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to the admin panel if the user is authenticated and has an "admin" role
  return NextResponse.next();
}

// Helper function to fetch user data (you would need to implement this based on your database)
async function fetchUserFromDB(uid: string) {
  // Simulating fetching user data
  // Replace this with the actual database logic
  const userDoc = await fetch(`/api/users/${uid}`).then((res) => res.json());
  return userDoc;
}

// Define the middleware route
export const config = {
  matcher: ["/dashboard/*"], // This matches the routes you want to protect (e.g., /dashboard)
};
