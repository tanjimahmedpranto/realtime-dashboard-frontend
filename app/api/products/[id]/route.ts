import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = params;

  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "PUT",
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

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      cookie: req.headers.get("cookie") ?? "",
    },
  });

  const data =
    res.status === 204 ? null : await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
