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
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { getFile, uploadFile } from "@/lib/firebase/storage";

export function DataAddDialog({ getBrands }: { getBrands: () => void }) {
  const [formData, setFormData] = useState({
    id: "",
    brandName: "",
    country: "",
    logo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      images: "",
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let uploadedImageUrl = formData.logo;

    try {
      const docRef = await addDoc(collection(db, "brands"), {
        brandName: formData.brandName,
        country: formData.country,
        // logo: imagePreview,
      });
      console.log("User brand with ID:", docRef.id);

      if (docRef.id !== "") {
        if (imageFile) {
          try {
            const folder = "brands/"; // Specify the folder (optional)
            const filePath = await uploadFile(imageFile, docRef.id, folder);
            console.log("File uploaded to:", filePath);
            const url = await getFile(filePath);
            setImagePreview(url);
            uploadedImageUrl = url
            await updateDoc(doc(db, "brands", docRef.id), {
              logo: uploadedImageUrl,
            });

            console.log("File available at:", url);
          } catch (error) {
            console.error("Error uploading file:", error);
            toast.warning("Error uploading file");
          }
        }

        toast.success("Brand add successfully!");
        getBrands(); // Refresh table data
        setOpen(false); // Close modal
      } else {
        setError("Error Brand registering");
        toast.error("Error Brand registering!");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      setError("Failed to update brand.");
    }
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button className="font-medium gap-3">
          Add Brand
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Brand</DialogTitle>
          <DialogDescription>
          Fill in the form below to add a new Brand. Click Add when
          you&apos;re done.
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
              {loading ? "Saving..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
