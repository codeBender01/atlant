import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://77.110.103.168:5008";

// Define the context type for the second parameter
type RouteContext = {
  params: Promise<{ endpoint: string[] }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  return handleRequest(request, params, "POST");
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  return handleRequest(request, params, "GET");
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  return handleRequest(request, params, "PUT");
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  return handleRequest(request, params, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  { endpoint }: { endpoint: string[] },
  method: string
) {
  try {
    const apiEndpoint = `/${endpoint.join("/")}`;

    // ✅ FIXED: Extract and forward query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";

    const fullUrl = `${API_BASE_URL}${apiEndpoint}${queryString}`;

    // 🐛 DEBUG: Log the URLs to verify query parameters are included
    console.log("=== PROXY DEBUG ===");
    console.log("Original URL:", request.url);
    console.log("Query params:", searchParams);
    console.log("Backend URL:", fullUrl);
    console.log("==================");

    let body = null;
    let contentType = "application/json";

    if (method !== "GET" && method !== "DELETE") {
      // Check if request contains FormData
      const requestContentType = request.headers.get("content-type");

      if (requestContentType?.includes("multipart/form-data")) {
        // Handle FormData
        body = await request.formData();
        contentType = requestContentType;
      } else {
        // Handle JSON
        body = JSON.stringify(await request.json());
      }
    }

    const headers: Record<string, string> = {
      ...(contentType === "application/json" && {
        "Content-Type": contentType,
      }),
      ...(request.headers.get("authorization") && {
        Authorization: request.headers.get("authorization")!,
      }),
    };

    // Don't set Content-Type for FormData - let fetch handle it
    if (contentType.includes("multipart/form-data")) {
      delete headers["Content-Type"];
    }

    const response = await fetch(fullUrl, {
      method,
      headers,
      ...(body && { body }),
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication failed",
          shouldLogout: true,
        },
        { status: 401 }
      );
    }

    const data = await response.json();

    // 🐛 DEBUG: Log response data to verify filtering worked

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy request failed:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
