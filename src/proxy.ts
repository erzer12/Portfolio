import { NextRequest, NextResponse } from 'next/server';

// In Next.js 16+, proxy.ts replaces middleware.ts.
// The exported function must be named "proxy".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;
    const adminCode = process.env.ADMIN_ACCESS_CODE;

    if (!token || token !== adminCode) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
