import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  role: string;
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          if (userData.role === "admin") {
            localStorage.setItem("user", JSON.stringify(userData));
            router.push("/dashboard"); // Redirect to dashboard if logged in and role is admin
          } else {
            signOut(auth);
            localStorage.removeItem("user");
          }
        }
      } else {
        // If no user is logged in, stay on the login page
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        if (userData.role === "admin") {
          localStorage.setItem("user", JSON.stringify(userData));
          router.push("/dashboard"); // Redirect to dashboard if user is admin
        } else {
          signOut(auth);
          toast.warning("You are not authorized to access this page");
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 mb-10">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Image
                  src="/logo-32.png"
                  width={42}
                  height={42}
                  alt="brand logo"
                />
              </div>
              <span className="sr-only">Evelyn</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Evelyn Admin</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {loading ? (
                <svg
                  className="mr-3 size-5 animate-spin ... "
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
