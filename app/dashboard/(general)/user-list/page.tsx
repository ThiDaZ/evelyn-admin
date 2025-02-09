"use client"
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns"; // Import getColumns function
import { z } from "zod";
import { userSchema } from "@/data/user-list/schema";
import { getUsers } from "./utils/getUsers"; // Import getUsers function
import { useEffect, useState } from "react";
import { DataAddDialog } from "./components/data-add-dialog"; // Import DataAddDialog component

export default function Page() {
  const [users, setUsers] = useState<z.infer<typeof userSchema>[]>([]);

  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User List</h2>
          <p className="text-muted-foreground">
            Manage your users and their roles here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DataAddDialog getUsers={fetchUsers} />
        </div>
      </div>

      {users.length > 0 ? <DataTable data={users} columns={getColumns(fetchUsers)} /> : <p>Loading...</p>}

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
