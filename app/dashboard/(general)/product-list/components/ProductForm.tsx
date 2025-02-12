"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { ProductFormData, Brand, Category, Product } from "../types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "./MultiSelect"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductFormProps {
  initialData?: ProductFormData
  onSubmit: (data: ProductFormData) => void
  isLoading: boolean
  brands: Brand[]
  categories: Category[]
  allProducts: Product[]
}

const skinTypeOptions = [
  { label: "Dry", value: "dry" },
  { label: "Oily", value: "oily" },
  { label: "Combination", value: "combination" },
  { label: "Normal", value: "normal" },
  { label: "Sensitive", value: "sensitive" },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  brands,
  categories,
  allProducts,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      brandID: "",
      categoryID: "",
      price: 0,
      stock: 0,
      description: "",
      ingredients: [],
      skinTypes: [],
      images: [],
      dupes: [],
    },
  )
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [openDupes, setOpenDupes] = useState(false)

  useEffect(() => {
    if (initialData?.images) {
      setImagePreviews(initialData.images)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value.split(",").map((item) => item.trim()) }))
  }

  const handleSkinTypesChange = (selected: string[]) => {
    setFormData((prev) => ({ ...prev, skinTypes: selected }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + imageFiles.length > 5) {
      alert("You can only upload a maximum of 5 images")
      return
    }

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return false
      }
      return true
    })

    setImageFiles((prev) => [...prev, ...validFiles])
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...newPreviews])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newPreviews] }))
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleDupeSelect = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      dupes: prev.dupes.includes(productId) ? prev.dupes.filter((id) => id !== productId) : [...prev.dupes, productId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="brandID">Brand</Label>
          <Select name="brandID" value={formData.brandID} onValueChange={handleSelectChange("brandID")}>
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="categoryID">Category</Label>
          <Select name="categoryID" value={formData.categoryID} onValueChange={handleSelectChange("categoryID")}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
          <Input
            id="ingredients"
            name="ingredients"
            value={formData.ingredients.join(", ")}
            onChange={handleArrayChange}
          />
        </div>

        <div>
          <Label htmlFor="skinTypes">Skin Types</Label>
          <MultiSelect
            options={skinTypeOptions}
            selected={formData.skinTypes}
            onChange={handleSkinTypesChange}
            placeholder="Select skin types..."
          />
        </div>

        <div>
          <Label htmlFor="images">Images (Max 5, each up to 5MB)</Label>
          <Input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={imagePreviews.length >= 5}
          />
          <p className="text-sm text-gray-500 mt-1">You can upload up to 5 images, each with a maximum size of 5MB.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-xs"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="dupes">Dupe Products</Label>
          <Popover open={openDupes} onOpenChange={setOpenDupes}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openDupes} className="w-full justify-between">
                {formData.dupes.length > 0
                  ? `${formData.dupes.length} product${formData.dupes.length > 1 ? "s" : ""} selected`
                  : "Select dupe products..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search products..." />
                <CommandList>
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    {allProducts.map((product) => (
                      <CommandItem key={product.id} onSelect={() => handleDupeSelect(product.id)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.dupes.includes(product.id) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {product.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

