import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL!;

export async function GET(request: NextRequest) {
  const backendRes = await fetch(`${BACKEND_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? ""
    }
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
