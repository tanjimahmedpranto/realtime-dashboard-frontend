"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

import { Product } from "@/types/product";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ProductFormDialog } from "./ProductFormDialog";
import { StatusDialog } from "./StatusDialog";
import { DeleteDialog } from "./DeleteDialog";

type DialogMode = "add" | "edit";

export function ProductTable() {
  const { data, isLoading, isError } = useRealtimeProducts();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<DialogMode>("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name"
      },
      {
        accessorKey: "category",
        header: "Category"
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const value = row.getValue<number>("price");
          return <span>${value.toFixed(2)}</span>;
        }
      },
      {
        accessorKey: "stock",
        header: "Stock"
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue<string>("status");
          const color =
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "inactive"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800";
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs rounded-full ${color}`}
            >
              {status}
            </span>
          );
        }
      },
 {
  accessorKey: "createdAt",
  header: "Created",
  cell: ({ row }) => {
    const iso = row.getValue<string | undefined>("createdAt");
    if (!iso) return null;

    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return <span className="text-xs text-slate-400">n/a</span>;
    }

    const formatted = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return <span>{formatted}</span>;
  }
}

,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedProduct(product);
                  setFormMode("edit");
                  setFormOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedProduct(product);
                  setStatusOpen(true);
                }}
              >
                Status
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedProduct(product);
                  setDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          );
        }
      }
    ],
    []
  );

const table = useReactTable({
  data: Array.isArray(data) ? (data as Product[]) : [],
  columns,
  getCoreRowModel: getCoreRowModel(),
});

  const handleAddClick = () => {
    setSelectedProduct(null);
    setFormMode("add");
    setFormOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <Button onClick={handleAddClick}
		className="bg-[#0e5af2] hover:bg-[#0b49c2]">Add Product</Button>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading products...</p>}
        {isError && (
          <p className="text-red-500">
            Failed to load products. Check console and network.
          </p>
        )}
        {!isLoading && !isError && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        product={selectedProduct}
      />

      <StatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        productId={selectedProduct?.id ?? null}
        currentStatus={selectedProduct?.status ?? "active"}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        productId={selectedProduct?.id ?? null}
        productName={selectedProduct?.name}
      />
    </Card>
  );
}

