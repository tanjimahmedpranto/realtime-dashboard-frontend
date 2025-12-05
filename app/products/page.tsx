export const dynamic = "force-dynamic";
import { MainNav } from "@/components/layout/MainNav";
import { ProductTable } from "@/components/products/ProductTable";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <MainNav />
      <main className="p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <h1 className="text-2xl font-semibold">Product Management</h1>
          <p className="text-sm text-slate-600">
            Manage products in real time. Changes in Firestore appear instantly.
          </p>
          <ProductTable />
        </div>
      </main>
    </div>
  );
}
