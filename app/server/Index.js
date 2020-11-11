const express = require('express'),
      bodyParser = require('body-parser'),
      eventMethods = require('./events'),
      logger = require('./helpers/logger'),
      { PORT } = require('./config');

const app = express();
app.use(bodyParser.json());

app.get('/events', eventMethods.getEvents);
app.get('/events/:eventId', eventMethods.getEvent);
app.delete('/events/:eventId', eventMethods.deleteEvent);
app.post('/events', eventMethods.createEvent);
app.put('/events/:eventId', eventMethods.updateEvent);
app.get('/events-batch', eventMethods.getEventsBatch);

app.listen(PORT, () => {
  logger.log(`Listening on port ${PORT}`)
});