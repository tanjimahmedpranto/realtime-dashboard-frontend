// app/api/products/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

function getTokenFromCookies(req: NextRequest) {
  return req.cookies.get("token")?.value;
}

// PATCH /api/products/[id]/status  →  PATCH {BACKEND_URL}/products/:id/status
export async function PATCH(req: NextRequest, context: any) {
  const token = getTokenFromCookies(req);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = context.params as { id: string };
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products/${id}/status`, {
    method: "PATCH",
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
