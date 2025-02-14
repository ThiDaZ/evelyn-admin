"use client";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { z } from "zod";
import { getSkinType } from "./utils/getSkinType";
import { useEffect, useState } from "react";
import { DataAddDialog } from "./components/data-add-dialog";
import { skinTypeSchema } from "@/data/skinType-list/schema";


export default function page() {
      const [skinType, setSkinType] = useState<z.infer<typeof skinTypeSchema>[]>([]);
    
      const fetchSkinTypes = async () => {
        const skinTypesData = await getSkinType();
        setSkinType(skinTypesData);
      };
    
      useEffect(() => {
        fetchSkinTypes();
      }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Skin Types List</h2>
          <p className="text-muted-foreground">
            Manage your skin types and their description here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DataAddDialog getSkinTypes={fetchSkinTypes} />
        </div>
      </div>

      {skinType.length > 0 ? (
        <DataTable data={skinType} columns={getColumns(fetchSkinTypes)} />
      ) : (
        <p>Loading...</p>
      )}

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
