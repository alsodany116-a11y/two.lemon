import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all subroutes, except /dashboard/login
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    const payload = await verifyToken(sessionCookie.value);
    
    if (!payload || !payload.authenticated) {
      // Token is invalid or expired, redirect to login
      const response = NextResponse.redirect(new URL('/dashboard/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

// Specify matcher to intercept only dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
