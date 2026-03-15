"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";
import { useState } from "react";

export interface ActionColumnConfig<T> {
  label?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  customActions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: "default" | "destructive" | "outline";
  }[];
}

export interface TableColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: Row<T>) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumnDef<T>[];
  actionConfig?: ActionColumnConfig<T>;
  getRowId: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  actionConfig,
  getRowId,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  onRowClick,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const tableColumns: ColumnDef<T>[] = columns.map((col) => ({
    id: col.id,
    accessorKey: col.accessorKey as string,
    header: col.header,
    ...(col.cell && { cell: col.cell }),
    sortable: col.sortable ?? true,
    enableColumnFilter: col.filterable ?? true,
  }));

  if (actionConfig) {
    tableColumns.push({
      id: "actions",
      header: actionConfig.label || "Acciones",
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-2">
            {actionConfig.onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actionConfig.onView!(rowData);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver
              </button>
            )}
            {actionConfig.onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actionConfig.onEdit!(rowData);
                }}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Editar
              </button>
            )}
            {actionConfig.onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actionConfig.onDelete!(rowData);
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Eliminar
              </button>
            )}
            {actionConfig.customActions?.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(rowData);
                }}
                className={`text-sm font-medium ${
                  action.variant === "destructive"
                    ? "text-red-600 hover:text-red-800"
                    : action.variant === "outline"
                    ? "text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        );
      },
    });
  }

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={getRowId(row.original)}
                  onClick={() => onRowClick?.(row.original)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}