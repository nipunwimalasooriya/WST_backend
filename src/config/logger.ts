import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  colorize({ all: true }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
  level: 'debug', 
  levels,
  format: logFormat,
  transports,
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim()); 
  },
};

export default logger;