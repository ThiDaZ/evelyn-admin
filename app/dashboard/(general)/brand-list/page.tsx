"use client";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { z } from "zod";
import { brandSchema } from "@/data/brand-list/schema";
import { getBrands } from "./utils/getBrands";
import { useEffect, useState } from "react";
import { DataAddDialog } from "./components/data-add-dialog";

export default function page() {
  const [brands, setBrands] = useState<z.infer<typeof brandSchema>[]>([]);

  const fetchBrands = async () => {
    const brandsData = await getBrands();
    setBrands(brandsData);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brands List</h2>
          <p className="text-muted-foreground">
            Manage your brands and their logos here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DataAddDialog getBrands={fetchBrands} />
        </div>
      </div>

      {brands.length > 0 ? (
        <DataTable data={brands} columns={getColumns(fetchBrands)} />
      ) : (
        <p>Loading...</p>
      )}

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}