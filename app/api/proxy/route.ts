import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const response = await fetch(
      "http://77.110.103.168:5008/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
