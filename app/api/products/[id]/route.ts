import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL!;

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") ?? ""
    },
    body: JSON.stringify(body)
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const backendRes = await fetch(`${BACKEND_API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      cookie: request.headers.get("cookie") ?? ""
    }
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
