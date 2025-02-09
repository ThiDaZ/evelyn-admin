import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { z } from "zod"
import fs from "fs/promises";
import path from "path";
import { taskSchema } from "@/data/user-list/schema"

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "data/user-list/task.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function Page() {
  const tasks = await getTasks();
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
          <Button className="font-medium gap-3">
            Add User
            <UserPlus />
          </Button>
        </div>
      </div>

      <DataTable data={tasks} columns={columns} />

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
