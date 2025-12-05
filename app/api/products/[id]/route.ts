// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function forwardHeaders(req: NextRequest) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.cookie = cookie;
  }

  return headers;
}

export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "PUT",
    headers: forwardHeaders(req),
    body: JSON.stringify(body),
    // TypeScript doesn’t know about credentials here, so cast:
    credentials: "include" as any,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest, context: any) {
  const { id } = context.params;
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products/${id}/status`, {
    method: "PATCH",
    headers: forwardHeaders(req),
    body: JSON.stringify(body),
    credentials: "include" as any,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;

  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "DELETE",
    headers: forwardHeaders(req),
    credentials: "include" as any,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
