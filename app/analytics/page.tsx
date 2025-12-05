"use client";

import { useMemo } from "react";
import { useRealtimeProducts } from "@/hooks/useRealtimeProducts";
import { Product } from "@/types/product";

import { MainNav } from "@/components/layout/MainNav";

import { RequireAuth } from "@/components/auth/RequireAuth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useRealtimeProducts();
  const products: Product[] = Array.isArray(data) ? (data as Product[]) : [];

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;
  const archivedCount = products.filter((p) => p.status === "archived").length;

  const statusData = useMemo(
    () => [
      { status: "active", count: activeCount },
      { status: "inactive", count: inactiveCount },
      { status: "archived", count: archivedCount },
    ],
    [activeCount, inactiveCount, archivedCount]
  );

  const statusChartConfig = {
    active: {
      label: "Active",
      color: "#0e5af2",
    },
    inactive: {
      label: "Inactive",
      color: "#22c55e",
    },
    archived: {
      label: "Archived",
      color: "#6b7280",
    },
  } satisfies ChartConfig;

  const stockByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const key = p.category || "Uncategorised";
      map.set(key, (map.get(key) || 0) + p.stock);
    }
    return Array.from(map.entries()).map(([category, stock]) => ({
      category,
      stock,
    }));
  }, [products]);

  const stockChartConfig = {
    stock: {
      label: "Total stock",
      color: "#0e5af2",
    },
  } satisfies ChartConfig;

  const valueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const key = p.category || "Uncategorised";
      const value = p.price * p.stock;
      map.set(key, (map.get(key) || 0) + value);
    }
    return Array.from(map.entries()).map(([category, value]) => ({
      category,
      value,
    }));
  }, [products]);

  const valueChartConfig = {
    value: {
      label: "Inventory value",
      color: "#f97316",
    },
  } satisfies ChartConfig;

  const totalStock = stockByCategory.reduce((sum, item) => sum + item.stock, 0);
  const totalInventoryValue = valueByCategory.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
  <RequireAuth>
    <div className="min-h-screen bg-slate-100">
      <MainNav />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <section>
          <h1 className="text-2xl font-semibold">Product Analytics</h1>
          <p className="text-sm text-slate-600">
            Real time insights based on your Firestore product data.
          </p>
        </section>

        {isLoading && <p>Loading analytics...</p>}
        {isError && (
          <p className="text-red-500">
            Failed to load products for analytics. Check console.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {/* Summary cards */}
            <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totalStock}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Inventory value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${totalInventoryValue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status pie chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Products by status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={statusChartConfig}
                    className="h-64 w-full"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        outerRadius={90}
                        strokeWidth={2}
                      >
                        {statusData.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={
                              statusChartConfig[
                                entry.status as keyof typeof statusChartConfig
                              ]?.color
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Stock by category bar chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock by category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={stockChartConfig}
                    className="h-64 w-full"
                  >
                    <BarChart data={stockByCategory}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="stock"
                        radius={[4, 4, 0, 0]}
                        fill={stockChartConfig.stock.color}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Value by category bar chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Inventory value by category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={valueChartConfig}
                    className="h-64 w-full"
                  >
                    <BarChart data={valueByCategory}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        fill={valueChartConfig.value.color}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
	</RequireAuth>
  );
}
