import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Admin routes — require admin/superadmin role
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    const role = token.role as string | undefined;
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protected account routes — require any authenticated session
  const protectedAccountPaths = [
    "/account/orders",
    "/account/wishlist",
    "/account/addresses",
    "/account/settings",
  ];
  if (protectedAccountPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/account/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/((?!login$).*)",
    "/account/orders/:path*",
    "/account/wishlist/:path*",
    "/account/addresses/:path*",
    "/account/settings/:path*",
  ],
};
