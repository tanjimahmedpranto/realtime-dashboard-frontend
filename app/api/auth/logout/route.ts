import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL!;

export async function POST(request: NextRequest) {
  const backendRes = await fetch(`${BACKEND_API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") ?? ""
    }
  });

  const data = await backendRes.json();
  const response = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
