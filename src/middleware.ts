import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  
  // Determine operation name based on path
  let operationName = 'page.view';
  if (pathname.startsWith('/api/')) {
    operationName = `api.${pathname.replace('/api/', '').replace(/\//g, '.')}`;
  } else if (pathname === '/') {
    operationName = 'page.home';
  } else if (pathname === '/integer-to-roman-numeral') {
    operationName = 'page.converter';
  }
  
  // Log the request (this will be captured by Datadog agent)
  console.log('Request started', {
    method,
    pathname,
    operation: operationName,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
    service: 'roman-numeral-ui',
  });

  try {
    // Continue to the next middleware or route handler
    const response = NextResponse.next();

    // Add response time metric
    const responseTime = Date.now() - startTime;
    
    console.log('Request completed', {
      method,
      pathname,
      operation: operationName,
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    // Log error
    console.error('Request failed', {
      method,
      pathname,
      operation: operationName,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
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