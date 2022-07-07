// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log("middleware llamado");

  return NextResponse.next();

  return new Response("Access Denied", {
    status: 401,
    headers: {
      "x-token": "no token!",
    },
  });
}
