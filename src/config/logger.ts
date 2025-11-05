import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Define the log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Define the log format
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  colorize({ all: true }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// We will only log to the console for this project
const transports = [new winston.transports.Console()];

// Create the logger instance
const logger = winston.createLogger({
  level: 'debug', // Log all levels from 'debug' and up
  levels,
  format: logFormat,
  transports,
});

// Create a stream object with a 'write' function that
// winston can use. This is for Morgan.
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim()); // Use 'http' level for Morgan logs
  },
};

export default logger;