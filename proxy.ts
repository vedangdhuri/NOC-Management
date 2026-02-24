import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/unauthorized"];

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    // Allow public paths without auth
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname === "/") {
        // Redirect authenticated users away from login
        if (token && (pathname === "/login" || pathname === "/register")) {
            return NextResponse.redirect(new URL("/dashboard/student", request.url));
        }
        return NextResponse.next();
    }

    // Protect all other routes
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
