// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not set in environment");
}

async function forwardToBackend(
  req: NextRequest,
  context: any,
  method: "PUT" | "DELETE"
) {
  // Next 16’s types say params can be a Promise, so we just await it
  const params = await context.params;
  const id = params.id as string;

  const url = `${BACKEND_API_URL}/products/${id}`;

  const token = req.cookies.get("token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Cookie"] = `token=${token}`;
  }

  let body: string | undefined;

  if (method === "PUT") {
    const json = await req.json();
    body = JSON.stringify(json);
  }

  const backendRes = await fetch(url, {
    method,
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

export async function PUT(req: NextRequest, context: any) {
  return forwardToBackend(req, context, "PUT");
}

export async function DELETE(req: NextRequest, context: any) {
  return forwardToBackend(req, context, "DELETE");
}
