// app/api/products/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not set in environment");
}

export async function PATCH(req: NextRequest, context: any) {
  const params = await context.params;
  const id = params.id as string;

  const url = `${BACKEND_API_URL}/products/${id}/status`;

  const token = req.cookies.get("token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Cookie"] = `token=${token}`;
  }

  const body = JSON.stringify(await req.json());

  const backendRes = await fetch(url, {
    method: "PATCH",
    headers,
    body,
    credentials: "include",
  });

  const text = await backendRes.text();

  return new NextResponse(text || null, {
    status: backendRes.status,
    headers: {
      "Content-Type":
        backendRes.headers.get("Content-Type") || "application/json",
    },
  });
}
