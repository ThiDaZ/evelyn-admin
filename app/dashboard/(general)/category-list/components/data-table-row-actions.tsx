"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataEdiDialog } from "./data-edit-dialog";
import { categorySchema } from "@/data/category-list/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  fetchCategories: () => void;
}

export function DataTableRowActions<TData>({
  row,
  fetchCategories,
}: DataTableRowActionsProps<TData>) {
  const initialData = categorySchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <DataEdiDialog getCategories={fetchCategories} row={initialData}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
