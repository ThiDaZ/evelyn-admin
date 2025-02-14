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
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function DataEdiDialog({
  getSkinTypes,
  row,
}: {
  getSkinTypes: () => void;
  row: {
    id: string;
    typeName: string;
    description: string;
    recommendedIngredients: string[];
  };
}) {
  const [formData, setFormData] = useState(
    row || {
      id: "",
      typeName: "",
      description: "",
      recommendedIngredients: [],
    }
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.id !== "") {
        await updateDoc(doc(db, "skinTypes", formData.id), {
          skinTypeName: formData.typeName,
          description: formData.description,
          recommendedIngredients: formData.recommendedIngredients,
          updatedAt: serverTimestamp(),
        });
        toast.success("SkinType updated successfully!");
        getSkinTypes(); // Refresh table data
        setOpen(false); // Close modal
      } else {
        setError("SkinType not found!");
        toast.error("SkinType not found!");
      }
    } catch (error) {
      console.error("Error updating skinType:", error);
      setError("Failed to update skinType.");
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
          Edit SkinTypes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit SkinType</DialogTitle>
          <DialogDescription>
            Update the skinTypes information below. Click Save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skinTypeName" className="text-right">
                SkinType Name
              </Label>
              <Input
                id="skinTypeName"
                required
                className="col-span-3"
                value={formData.typeName}
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
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recommendedIngredients">
                Recommended Ingredients (comma-separated)
              </Label>
              <Textarea
                id="recommendedIngredients"
                name="recommendedIngredients"
                className="col-span-3"
                value={formData.recommendedIngredients.join(", ")}
                onChange={handleArrayChange}
                required
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
