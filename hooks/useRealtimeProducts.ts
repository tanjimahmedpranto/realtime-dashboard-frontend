// hooks/useRealtimeProducts.ts
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Product } from "@/types/product";

interface RealtimeProductsState {
  data: Product[] | null;
  isLoading: boolean;
  isError: boolean;
}

const normalizeDate = (value: any): string | undefined => {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return undefined;
};

export function useRealtimeProducts(): RealtimeProductsState {
  const [data, setData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const q = query(
      collection(firestore, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const products: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;

          return {
            id: doc.id,
            name: data.name ?? "",
            price: Number(data.price ?? 0),
            stock: Number(data.stock ?? 0),
            category: data.category ?? "",
            status: data.status ?? "active",
            createdAt: normalizeDate(data.createdAt),
            updatedAt: normalizeDate(data.updatedAt),
          };
        });

        setData(products);
        setIsLoading(false);
        setIsError(false);
      },
      (error) => {
        console.error("Firestore subscription error:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, isLoading, isError };
}
