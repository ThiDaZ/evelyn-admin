"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { roles, statuses } from "@/data/user-list/data"
import { Users } from "@/data/user-list/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const getColumns = (fetchUsers: () => void): ColumnDef<Users>[] => [
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
    accessorKey: "fullName", //id
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => <div className="space-x-2 max-w-[500px] ">{row.getValue("fullName")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "email", //title
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[180px]">
        <span className="truncate font-medium">
          {row.getValue("email")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("mobile")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "status", //status
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Status" />),
    cell: ({ row }) => {
      const status = statuses.find(
        (status: { value: string; label: string; icon?: React.ComponentType }) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = roles.find(
        (role: { value: string; label: string; icon?: React.ComponentType }) => role.value === row.getValue("role")
      )

      if (!role) {
        return null
      }

      return (
        <div className="flex items-center">
          {role.icon && (
            <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{role.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} fetchUsers={fetchUsers} />, // Pass fetchUsers function
  },
]