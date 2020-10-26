const log = function (...args) { console.log(...args); };
const debug = function (...args) { console.debug(...args); };
const error = function (...args) { console.error(...args); };
const warn = function (...args) { console.warn(...args); };

module.exports = {
  log,
  debug,
  error,
  warn
};
