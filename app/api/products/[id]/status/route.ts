import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function PATCH(req: NextRequest, { params }: any) {
  const { id } = params;
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  const data =
    res.status === 204 ? null : await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
