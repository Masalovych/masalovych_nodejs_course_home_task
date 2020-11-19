const logger = require('./logger');
const { getRequestContext }  = require('../hooks');

function logErrors(err, req, res, next) {
  logger.error(getRequestContext(), {stack: err.stack});
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.statusCode = 500;
    res.json({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.statusCode = 500;
  res.json({ error: err });
}

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler
};

