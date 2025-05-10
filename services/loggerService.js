const { createLogger, format, transports } = require('winston');
const contextService = require('./contextService');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...rest }) => {
      const traceId = contextService.get('traceId') || 'no-trace';
      const meta = Object.keys(rest).length ? JSON.stringify(rest) : '';
      return `[${timestamp}] ${level.toUpperCase()} [${traceId}]: ${message} ${meta}`;
    })
  ),
  transports: [new transports.Console()]
});

module.exports = {
  info: (msg) => logger.info(msg),
  error: (msg, meta) => logger.error(msg, meta),
  warn: (msg) => logger.warn(msg),
  verbose: (msg) => logger.verbose(msg)
};