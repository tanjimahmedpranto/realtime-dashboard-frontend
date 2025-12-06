// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

function getTokenFromCookies(req: NextRequest) {
  return req.cookies.get("token")?.value;
}

// GET /api/products  →  GET {BACKEND_URL}/products
export async function GET(req: NextRequest) {
  const token = getTokenFromCookies(req);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/products`, {
    method: "GET",
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

  return NextResponse.json(data, { status: res.status });
}

// POST /api/products  →  POST {BACKEND_URL}/products
export async function POST(req: NextRequest) {
  const token = getTokenFromCookies(req);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products`, {
    method: "POST",
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
