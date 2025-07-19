// This file is used to initialize Datadog before the Next.js server starts
// It runs once when the server starts up

import tracer from 'dd-trace';

// Initialize Datadog tracer
if (process.env.NODE_ENV === 'production') {
  tracer.init({
    service: 'roman-numeral-ui',
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    logInjection: true,
    runtimeMetrics: true,
    profiling: true,
  });
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side only initialization
    console.log('Datadog tracer initialized for roman-numeral-ui');
  }
} 