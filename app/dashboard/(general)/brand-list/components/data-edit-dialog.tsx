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
import { db } from "@/lib/firebase/config"; // Import Firebase SDK
import Image from "next/image";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { getFile, uploadFile } from "@/lib/firebase/storage";

export function DataEdiDialog({
  getBrands,
  row,
}: {
  getBrands: () => void;
  row: {
    id: string;
    brandName: string;
    country: string;
    logo: string;
  };
}) {
  const [formData, setFormData] = useState(
    row || {
      id: "",
      brandName: "",
      country: "",
      logo: "",
    }
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (formData.logo) {
      setImagePreview(formData.logo);
      console.log(formData.logo);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_FILE_SIZE = 1 * 1024 * 1024; //

    if (file.size > MAX_FILE_SIZE) {
      toast.warning(`File ${file.name} is too large. Maximum size is 1MB.`);
      return;
    }

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setFormData((prev) => ({
      ...prev,
      images: preview,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let uploadedImageUrl = formData.logo;

    try {
      if (formData.id !== "") {
        if (imageFile) {
          try {
            const folder = "brands/"; // Specify the folder (optional)
            const filePath = await uploadFile(imageFile, row.id, folder);
            console.log("File uploaded to:", filePath);
            const url = await getFile(filePath);
            setImagePreview(url);
            console.log("File available at:", url);
            uploadedImageUrl = url;
          } catch (error) {
            console.error("Error uploading file:", error);
            toast.warning("Error uploading file")
          }
        }
        await updateDoc(doc(db, "brands", formData.id), {
          brandName: formData.brandName,
          country: formData.country,
          logo: uploadedImageUrl,
        });
        toast.success("Brand updated successfully!");
        getBrands(); // Refresh table data
        setOpen(false); // Close modal
      } else {
        setError("Brand not found!");
        toast.error("Brand not found!");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      setError("Failed to update brand.");
    }
    setLoading(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      images: "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="font-medium justify-start text-start w-full p-2"
        >
          Edit Brands
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Update the brands information below. Click Save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brandName" className="text-right">
                Brand Name
              </Label>
              <Input
                id="brandName"
                required
                className="col-span-3"
                value={formData.brandName}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Input
                id="country"
                required
                className="col-span-3"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Logo
              </Label>
              <Input
                className="col-span-3"
                required
                id="images"
                name="images"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                disabled={!!imagePreview}
              />
            </div>
            <div className="flex flex-wrap">
              <p className="text-sm text-gray-500 mt-1">
                You can upload 1 image, maximum size of 1MB. Only PNG and JPG
                files are allowed.
              </p>
              {imagePreview && (
                <div className="mt-2 relative ">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              )}
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
