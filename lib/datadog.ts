import tracer from 'dd-trace';
import { StatsD } from 'hot-shots';
import winston from 'winston';

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

// Initialize StatsD for metrics
export const statsd = new StatsD({
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

// Initialize Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'roman-numeral-ui',
    env: process.env.NODE_ENV || 'development',
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: '/var/log/roman-numeral-ui/roman-numeral-ui.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Helper functions for metrics
export const metrics = {
  increment: (name: string, tags?: string[]) => {
    statsd.increment(name, tags);
  },
  gauge: (name: string, value: number, tags?: string[]) => {
    statsd.gauge(name, value, tags);
  },
  timing: (name: string, value: number, tags?: string[]) => {
    statsd.timing(name, value, tags);
  },
  histogram: (name: string, value: number, tags?: string[]) => {
    statsd.histogram(name, value, tags);
  },
};

// Helper functions for tracing
export const tracing = {
  trace: (name: string, fn: () => any) => {
    return tracer.trace(name, fn);
  },
  wrap: (name: string, fn: Function) => {
    return tracer.wrap(name, fn);
  },
};

export default {
  tracer,
  statsd,
  logger,
  metrics,
  tracing,
}; 