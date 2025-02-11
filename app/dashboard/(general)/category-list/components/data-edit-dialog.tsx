"use client";
import { useState } from "react";
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
import { db } from "@/lib/firebase/config"; // Import Firebase SDK
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

export function DataEdiDialog({
  getCategories,
  row,
}: {
  getCategories: () => void;
  row: {
    id: string;
    categoryName: string;
    description: string;
  };
}) {
  const [formData, setFormData] = useState(
    row || {
      id: "",
      categoryName: "",
      description: "",
    }
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.id !== "") {
        await updateDoc(doc(db, "categories", formData.id), {
          categoryName: formData.categoryName,
          description: formData.description,
        });
        toast.success("Category updated successfully!");
        getCategories(); // Refresh table data
        setOpen(false); // Close modal
      } else {
        setError("Category not found!");
        toast.error("Category not found!");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="font-medium justify-start text-start w-full p-2"
        >
          Edit Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the categories information below. Click Save when you&apos;re
            done.
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
              <Input
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
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
