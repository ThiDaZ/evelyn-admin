"use client";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { z } from "zod";
import { productSchema } from "@/data/product-list/schema";
import { getProducts } from "./utils/getProducts";
import { useEffect, useState } from "react";
// import { DataAddDialog } from "./components/data-add-dialog";

export default function page() {
  const [products, setProducts] = useState<z.infer<typeof productSchema>[]>([]);

  const fetchProducts = async () => {
    const productsData = await getProducts();
    setProducts(productsData);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products List</h2>
          <p className="text-muted-foreground">
            Manage your products and their logos here.
          </p>
        </div>
        <div className="flex items-center space-x-2 ">

          {/* <DataAddDialog getProducts={fetchProducts} /> */}
        </div>
      </div>
      {products.length > 0 ? (
        <DataTable data={products} columns={getColumns(fetchProducts)} />
      ) : (
        <p>Loading...</p>
      )}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
