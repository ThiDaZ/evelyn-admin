"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { SkinType } from "@/data/skinType-list/schema"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const getColumns = (fetchSkinTypes: () => void): ColumnDef<SkinType>[] => [
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
    accessorKey: "typeName", //id
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SkinType Name" />
    ),
    cell: ({ row }) => <div className="space-x-2 max-w-[500px] ">{row.getValue("typeName")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "description", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div className="w-full">{row.getValue("description")}</div>,
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} fetchSkinTypes={fetchSkinTypes} />, // Pass fetchUsers function
  },
]