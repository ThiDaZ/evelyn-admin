"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import React from "react";

interface optionsProps {
  value: string;
  label: string;
  icon: any;
}

interface filtersProps {
  column: string;
  title: string;
  options: optionsProps[];
}

interface DataProps{
  filters: filtersProps[];
  search: {
    placeholder: string;
    column: string;
  };
  viewOption: boolean;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: {
    placeholder: string;
    column: string;
  };
  filters: filtersProps[];
  viewOption: boolean;
}

export function DataTableToolbar<TData>({
  table,
  search,
  filters,
  viewOption,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={search.placeholder}
          value={
            (table.getColumn(search.column)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(search.column)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filters.length > 0 &&
          filters.map((items : filtersProps, index) => (
            <div key={index}>
              {table.getColumn(items.column) && (
                <DataTableFacetedFilter
                  column={table.getColumn(items.column)}
                  title={items.title}
                  options={items.options}
                />
              )}
            </div>
          ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>

      {viewOption && <DataTableViewOptions table={table} />}
    </div>
  );
}
