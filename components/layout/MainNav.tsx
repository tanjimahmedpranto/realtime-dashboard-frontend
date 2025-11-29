"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/lib/apiSlice";
import { setUser } from "@/lib/authSlice";
import type { RootState } from "@/lib/store";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const email = useSelector((state: RootState) => state.auth.email);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(setUser(null));
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = (path: string) =>
    `text-sm px-3 py-2 rounded-md ${
      pathname.startsWith(path)
        ? "bg-[#0e5af2] text-white"
        : "text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-lg">Product Dashboard</span>
          <nav className="flex items-center gap-2">
            <Link href="/products" className={linkClass("/products")}>
              Products
            </Link>
            <Link href="/analytics" className={linkClass("/analytics")}>
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="text-xs text-slate-500 hidden sm:inline">
              {email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
