import { NextRequest, NextResponse } from 'next/server';
import { tracer, statsd } from '../../../../instrumentation';
import { createLogger } from '../../../utils/logger';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const logger = createLogger('health');
  
  // Create a span for this request
  const span = tracer.startSpan('health.check');
  
  try {
    // Increment request counter
    statsd.increment('health_check.requested');
    
    // Log the health check request using structured logging
    logger.info({
      msg: 'Health check requested',
      method: 'GET',
      url: request.url,
      userAgent: request.headers.get('user-agent'),
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
    
    logger.info({
      msg: 'Health check completed',
      responseTime,
      status: 200,
    });

    // Set span tags
    span.setTag('http.status_code', 200);
    span.setTag('http.method', 'GET');
    span.setTag('http.url', request.url);
    span.setTag('response_time', responseTime);

    return response;
  } catch (error) {
    // Log error using structured logging
    logger.error({
      msg: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
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