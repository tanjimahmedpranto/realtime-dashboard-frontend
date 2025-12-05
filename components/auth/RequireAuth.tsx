"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMeQuery } from "@/lib/apiSlice";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { data, error, isLoading } = useMeQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If /auth/me fails or returns no user, redirect to /login
    if (error || !data?.email) {
      const from = encodeURIComponent(pathname || "/products");
      router.replace(`/login?from=${from}`);
    }
  }, [data, error, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">Checking session…</p>
      </div>
    );
  }

  if (error || !data?.email) {
    // While redirecting, render nothing
    return null;
  }

  return <>{children}</>;
}
