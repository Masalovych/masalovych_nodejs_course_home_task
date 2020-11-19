const express = require('express');
const bodyParser = require('body-parser');
const eventMethods = require('./events');
const logger = require('./helpers/logger');
const { PORT } = require('./config');
const asyncHooks = require('./hooks');
const { logErrors, clientErrorHandler, errorHandler } = require('./helpers/errorHandlers');

const app = express();

app.use((req, res, next) => {
  const data = { headers: req.headers };
  asyncHooks.createRequestContext(data);
  next();
});
app.use(bodyParser.json());

app.get('/events', eventMethods.getEvents);
app.get('/events/:eventId', eventMethods.getEvent);
app.delete('/events/:eventId', eventMethods.deleteEvent);
app.post('/events', eventMethods.createEvent);
app.put('/events/:eventId', eventMethods.updateEvent);
app.get('/events-batch', eventMethods.getEventsBatch);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
});