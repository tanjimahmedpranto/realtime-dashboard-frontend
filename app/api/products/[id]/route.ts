// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

function getTokenFromCookies(req: NextRequest) {
  return req.cookies.get("token")?.value;
}

// PUT /api/products/[id]  →  PUT {BACKEND_URL}/products/:id
export async function PUT(req: NextRequest, context: any) {
  const token = getTokenFromCookies(req);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = context.params as { id: string };
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return NextResponse.json(data, { status: res.status });
}

// DELETE /api/products/[id]  →  DELETE {BACKEND_URL}/products/:id
export async function DELETE(req: NextRequest, context: any) {
  const token = getTokenFromCookies(req);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = context.params as { id: string };

  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: `token=${token}`,
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  // if backend returns nothing but 200, still send a success flag
  return NextResponse.json(data ?? { success: res.ok }, { status: res.status });
}
