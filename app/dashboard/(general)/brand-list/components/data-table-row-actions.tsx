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
import { userSchema } from "@/data/user-list/schema";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "sonner";
import { DataEdiDialog } from "./data-edit-dialog";
import { useEffect, useState } from "react";
import { getSessionUserEmail } from "@/lib/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  fetchBrands: () => void;
}

export function DataTableRowActions<TData>({
  row,
  fetchBrands,
}: DataTableRowActionsProps<TData>) {
  // const users = userSchema.parse(row.original);
  // const [disable, setDisable] = useState(false);

  // useEffect(() => {
  //   if (users.email === getSessionUserEmail()) {
  //     setDisable(true);
  //   }
  // }, [users.email]);

  // const handleDeactivateUserByEmail = async (email: string) => {
  //   if (!email) return;

  //   try {
  //     const q = query(collection(db, "users"), where("email", "==", email));
  //     const querySnapshot = await getDocs(q);

  //     if (querySnapshot.empty) {
  //       toast.warning("User not found!");
  //       return;
  //     }

  //     const userDoc = querySnapshot.docs[0];
  //     const newStatus = users.status === "active" ? "deactivated" : "active";
  //     await updateDoc(doc(db, "users", userDoc.id), {
  //       status: newStatus,
  //     });

  //     fetchBrands(); // Refresh the table after update
  //     toast.success("User " + newStatus + " successfully");
  //   } catch (error) {
  //     console.error("Error deactivating user:", error);
  //   }
  // };

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
          <DataEdiDialog getBrands={fetchBrands} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
