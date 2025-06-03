import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '../auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isSignInRoute = request.nextUrl.pathname === '/signin';

  // If trying to access admin routes without authentication
  if (isAdminRoute && !session) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated user tries to access signin page
  if (isSignInRoute && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/admin/:path*', '/signin'],
}; 