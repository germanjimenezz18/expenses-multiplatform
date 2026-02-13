import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
])

export default clerkMiddleware(async (auth, request) => {
    const authResult = await auth();

    if (isProtectedRoute(request) && !authResult.userId) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', request.url);
        return NextResponse.redirect(signInUrl);
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
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};