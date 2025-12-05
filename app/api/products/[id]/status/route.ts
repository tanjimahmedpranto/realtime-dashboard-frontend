import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next 16 expects params as a Promise now
    const { id } = await context.params;

    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/products/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // forward any cookies (for your HttpOnly token at the backend domain)
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    const data = await backendRes.json();

    return new NextResponse(JSON.stringify(data), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in /api/products/[id]/status proxy:", err);
    return new NextResponse(
      JSON.stringify({ message: "Failed to update product status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
