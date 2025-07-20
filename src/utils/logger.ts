import pino from 'pino';

// Create a pino logger instance similar to the roman-numeral-service
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Structured logging format
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  // Add service name and environment
  base: {
    service: 'roman-numeral-ui',
    env: process.env.NODE_ENV || 'development',
  },
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
}, 
// Output to file for Datadog collection in production, stdout in development
process.env.NODE_ENV === 'production' 
  ? pino.destination('/var/log/roman-numeral-ui/roman-numeral-ui.log')
  : pino.destination(1) // stdout
);

// Export a function to create child loggers with context
export const createLogger = (context: string) => {
  return logger.child({ context });
}; 