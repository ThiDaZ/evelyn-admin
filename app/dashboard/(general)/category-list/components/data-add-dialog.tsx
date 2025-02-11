"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/config"; // Import Firebase SDK
import {
  collection,
  addDoc,

} from "firebase/firestore";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea"


export function DataAddDialog({
  getCategories,
}: {
  getCategories: () => void;
}) {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "categories"), {
        categoryName: formData.categoryName,
        description: formData.description,
      });
      console.log("Category with ID:", docRef.id);
      toast.success("Category add successfully!");
      getCategories(); // Refresh table data
      setOpen(false); // Close modal
      setFormData({
        categoryName: "",
        description: "",
      })

    } catch (error) {
        setError("Error Category registering");
        toast.error("Error Category registering!");
    }
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-medium gap-3">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new Category. Click Add when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Category Name
              </Label>
              <Input
                id="categoryName"
                required
                className="col-span-3"
                value={formData.categoryName}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
               id="description"
               required
               className="col-span-3"
               value={formData.description}
               onChange={handleChange}
              />
     
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
