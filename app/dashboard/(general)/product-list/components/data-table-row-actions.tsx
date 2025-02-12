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
// import { DataEdiDialog } from "./data-edit-dialog";
import { productSchema } from "@/data/product-list/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  fetchProducts: () => void;
}

export function DataTableRowActions<TData>({
  row,
  fetchProducts,
}: DataTableRowActionsProps<TData>) {
  const initialData = productSchema.parse(row.original);
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
          {/* <DataEdiDialog getProducts={fetchProducts} row={initialData}/> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
