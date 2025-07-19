import { NextRequest, NextResponse } from 'next/server';
import { tracer, statsd } from '../../../../instrumentation';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Create a span for this request
  const span = tracer.startSpan('health.check');
  
  try {
    // Increment request counter
    statsd.increment('health_check.requested');
    
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
    
    // Send metrics
    statsd.timing('health_check.response_time', responseTime);
    statsd.increment('health_check.success');
    
    console.log('Health check completed', {
      responseTime,
      status: 200,
      timestamp: new Date().toISOString(),
    });

    // Set span tags
    span.setTag('http.status_code', 200);
    span.setTag('http.method', 'GET');
    span.setTag('http.url', request.url);
    span.setTag('response_time', responseTime);

    return response;
  } catch (error) {
    // Log error
    console.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Send error metrics
    statsd.increment('health_check.error');

    // Set error span tags
    span.setTag('error', true);
    span.setTag('error.message', error instanceof Error ? error.message : 'Unknown error');

    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    // Finish the span
    span.finish();
  }
} 