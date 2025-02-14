"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Product } from "@/data/product-list/schema"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"

export const getColumns = (fetchProducts: () => void): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "images", // Reference the full images array
    header: "Product Image",
    cell: ({ row }) => {
      const images: string[] = row.getValue("images") || []; // Get images array
      const firstImage = images.length > 0 ? images[0] : "/placeholder.svg"; // Pick first image
  
      return (
        <Image
          src={firstImage}
          alt={row.getValue("name")}
          width={50}
          height={50}
          className="rounded-md"
        />
      );
    },
  },
  
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => <div className="space-x-2 max-w-[500px] ">{row.getValue("name")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "price", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("price")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "stock", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("stock")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "brandName", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="brand" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("brandName")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "categoryName", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("categoryName")}</div>,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} fetchProducts={fetchProducts} />, // Pass fetchUsers function
  },
]