import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const authResult = await auth();

  if (isProtectedRoute(request) && !authResult.userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isProtectedRoute(request)) {
    const { searchParams } = request.nextUrl;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!(from || to)) {
      const savedFilter = request.cookies.get("expense-date-filter");
      if (savedFilter) {
        try {
          const parsed = JSON.parse(decodeURIComponent(savedFilter.value)) as {
            state?: { from?: string; to?: string };
          };
          const { from: savedFrom, to: savedTo } = parsed.state ?? {};
          if (savedFrom && savedTo) {
            const url = request.nextUrl.clone();
            url.searchParams.set("from", savedFrom);
            url.searchParams.set("to", savedTo);
            return NextResponse.redirect(url);
          }
        } catch {
          // Ignore parsing errors and proceed without redirect
        }
      }
    }
  }

  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
