"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Brand } from "@/data/brand-list/schema"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"

export const getColumns = (fetchBrands: () => void): ColumnDef<Brand>[] => [
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
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => (
      <Image
        src={row.getValue("logo") || "/placeholder.svg"}
        alt={row.getValue("brandName")}
        width={50}
        height={50}
        className="rounded-md"
      />
    ),
  },
  {
    accessorKey: "brandName", //id
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand Name" />
    ),
    cell: ({ row }) => <div className="space-x-2 max-w-[500px] ">{row.getValue("brandName")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "country", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("country")}</div>,
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} fetchBrands={fetchBrands} />, // Pass fetchUsers function
  },
]