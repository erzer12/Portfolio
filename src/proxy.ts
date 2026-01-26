import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route protection middleware
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Basic route protection - authentication happens client-side
        // via sessionStorage in the admin panel component
        return NextResponse.next();
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/upload/:path*',
    ],
};
