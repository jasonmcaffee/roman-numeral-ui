import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '../utils/logger';

export function loggingMiddleware(request: NextRequest) {
  const startTime = Date.now();
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const logger = createLogger('middleware');

  // Determine operation name based on path
  let operationName = 'page.view';
  if (pathname.startsWith('/api/')) {
    operationName = `api.${pathname.replace('/api/', '').replace(/\//g, '.')}`;
  } else if (pathname === '/') {
    operationName = 'page.home';
  } else if (pathname === '/integer-to-roman-numeral') {
    operationName = 'page.converter';
  }

  // Log the request using structured logging (similar to roman-numeral-service)
  logger.info({
    msg: 'Request started',
    method,
    pathname,
    operation: operationName,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
  });

  try {
    // Continue to the next middleware or route handler
    const response = NextResponse.next();

    // Add response time metric
    const responseTime = Date.now() - startTime;

    logger.info({
      msg: 'Request completed',
      method,
      pathname,
      operation: operationName,
      responseTime,
      statusCode: response.status,
    });

    return response;
  } catch (error) {
    // Log error using structured logging
    logger.error({
      msg: 'Request failed',
      method,
      pathname,
      operation: operationName,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
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
