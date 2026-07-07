import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const managerRoutes = ['/dashboard', '/team-reports', '/projects', '/ai-assistant'];
const memberRoutes = ['/reports'];
const authRoutes = ['/login', '/register'];

const startsWithAny = (pathname: string, routes: string[]) => {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('wr_auth')?.value === '1';
  const role = request.cookies.get('wr_role')?.value;

  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(role === 'manager' ? '/dashboard' : '/reports', request.url));
  }

  const isManagerRoute = startsWithAny(pathname, managerRoutes);
  const isMemberRoute = startsWithAny(pathname, memberRoutes);

  if ((isManagerRoute || isMemberRoute) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isManagerRoute && role !== 'manager') {
    return NextResponse.redirect(new URL('/reports', request.url));
  }

  if (isMemberRoute && role === 'manager') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/reports/:path*', '/dashboard/:path*', '/team-reports/:path*', '/projects/:path*', '/ai-assistant/:path*']
};
