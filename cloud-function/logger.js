const winston = require('winston');

// Define log levels
const levels = {
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  debug: 4,
};

// Get log level from environment or use default
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const logLevel = process.env.LOG_LEVEL || 'info';
  return env === 'development' ? 'debug' : logLevel;
};

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger; 