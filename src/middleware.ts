import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// runs every request
export async function middleware(request: NextRequest) {
  // route definition 
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/events');
  const isAuthRoute = path === '/login' || path === '/register';

  // cookie handling/verification
  const cookie = request.cookies.get('session')?.value;
  let isVerified = false;
  if (cookie) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(cookie, secret);
      isVerified = true;
    } catch (error) {
      isVerified = false;
    }
  }

  // page access logic
  if (isProtectedRoute && !isVerified) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuthRoute && isVerified) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};