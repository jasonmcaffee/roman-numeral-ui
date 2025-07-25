import { NextRequest, NextResponse } from 'next/server';
import { loggingMiddleware } from './src/middleware/logging.middleware';

export function middleware(request: NextRequest) {
  return loggingMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 