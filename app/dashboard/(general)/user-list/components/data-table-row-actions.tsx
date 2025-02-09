"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { labels } from "@/data/user-list/data";
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
// import { getSessionUserEmail } from "@/lib/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  fetchUsers: () => void; // Accept fetchUsers function as a prop
}

export function DataTableRowActions<TData>({
  row,
  fetchUsers, // Use fetchUsers function
}: DataTableRowActionsProps<TData>) {
  const users = userSchema.parse(row.original);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (users.email === getSessionUserEmail()) {
      setDisable(true);
    }
  }, [users.email]);

  const handleDeactivateUserByEmail = async (email: string) => {
    if (!email) return;

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.warning("User not found!");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const newStatus = users.status === "active" ? "deactivated" : "active";
      await updateDoc(doc(db, "users", userDoc.id), {
        status: newStatus,
      });

      fetchUsers(); // Refresh the table after update
      toast.success("User " + newStatus + " successfully");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return (
    <DropdownMenu>
      {disable ? (
        <DropdownMenuTrigger asChild disabled>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <DataEdiDialog userEmail={users.email} getUsers={fetchUsers} />
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={users.status}>
              {labels.map((label: { value: string; label: string }) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeactivateUserByEmail(users.email)}
        >
          {users.status === "active" ? "Deactivate" : "Activate"}
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
