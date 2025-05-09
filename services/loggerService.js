const { createLogger, format, transports } = require('winston');
const contextService = require('./contextService');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      const traceId = contextService.get('traceId') || 'no-trace';
      return `[${timestamp}] ${level.toUpperCase()} [${traceId}]: ${message}`;
    })
  ),
  transports: [new transports.Console()]
});

module.exports = {
  info: (msg) => logger.info(msg),
  error: (msg) => logger.error(msg),
  warn: (msg) => logger.warn(msg),
  verbose: (msg) => logger.verbose(msg)
};