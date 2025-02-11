"use client";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { z } from "zod";
import { getCategories } from "./utils/getCategories";
import { useEffect, useState } from "react";
import { DataAddDialog } from "./components/data-add-dialog";
import { categorySchema } from "@/data/category-list/schema";


export default function page() {
      const [category, setCategory] = useState<z.infer<typeof categorySchema>[]>([]);
    
      const fetchCategories = async () => {
        const categoriesData = await getCategories();
        setCategory(categoriesData);
      };
    
      useEffect(() => {
        fetchCategories();
      }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories List</h2>
          <p className="text-muted-foreground">
            Manage your categories and their description here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DataAddDialog getCategories={fetchCategories} />
        </div>
      </div>

      {category.length > 0 ? (
        <DataTable data={category} columns={getColumns(fetchCategories)} />
      ) : (
        <p>Loading...</p>
      )}

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
