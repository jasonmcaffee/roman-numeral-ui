// This file is used to initialize Datadog before the Next.js server starts
// It runs once when the server starts up

import tracer from 'dd-trace';
import { StatsD } from 'hot-shots';

// Initialize StatsD for metrics
const statsd = new StatsD({
  host: process.env.DD_AGENT_HOST || 'localhost',
  port: 8125,
  prefix: 'roman_numeral_ui.',
  globalTags: {
    service: 'roman-numeral-ui',
    env: process.env.NODE_ENV || 'development',
  },
  errorHandler: (error) => {
    console.error('StatsD error:', error);
  },
});

// Initialize tracer
console.log('Initializing Datadog tracer in instrumentation...');
tracer.init({
  service: 'roman-numeral-ui',
  env: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
  profiling: true,
});
console.log('Datadog tracer initialized in instrumentation');

// Export for use in other server-side files
export { tracer, statsd }; 