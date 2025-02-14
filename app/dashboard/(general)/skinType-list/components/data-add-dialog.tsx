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
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function DataAddDialog({ getSkinTypes }: { getSkinTypes: () => void }) {
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    recommendedIngredients: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "skinTypes"), {
        typeName: formData.typeName,
        description: formData.description,
        recommendedIngredients: formData.recommendedIngredients,
        createdAt: serverTimestamp(),
      });
      console.log("SkinType with ID:", docRef.id);
      toast.success("SkinType add successfully!");
      getSkinTypes(); // Refresh table data
      setOpen(false); // Close modal
      setFormData({
        typeName: "",
        description: "",
        recommendedIngredients: [],
      });
    } catch (error) {
      setError("Error Skin Type registering");
      toast.error("Error Skin Type registering!");
    }
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-medium gap-3">Add Skin Type</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Skin Type</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new Skin Type. Click Add when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="typeName" className="text-right">
                Skin Type Name
              </Label>
              <Input
                id="typeName"
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
              {loading ? "Saving..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
