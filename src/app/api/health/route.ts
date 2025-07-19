import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Log the health check request
    console.log('Health check requested', {
      method: 'GET',
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      service: 'roman-numeral-ui',
    });

    const response = NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'roman-numeral-ui',
        version: process.env.npm_package_version || '1.0.0'
      },
      { status: 200 }
    );

    // Add response time metric
    const responseTime = Date.now() - startTime;
    console.log('Health check completed', {
      responseTime,
      status: 200,
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    // Log error
    console.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 