const logger = require('pino')();

const info = function (...args) { logger.info(...args); };
const debug = function (...args) { logger.debug(...args); };
const error = function (...args) { logger.error(...args); };
const warn = function (...args) { logger.warn(...args); };

module.exports = {
  info,
  debug,
  error,
  warn
};
