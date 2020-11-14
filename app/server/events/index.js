const stream = require('stream');
const {getAllEvents, saveEventsToFile} = require('../helpers/csvDataHandlers');
const asyncHooks = require('../hooks');
const logger = require('../helpers/logger');

// curl localhost:3000/events?location=lviv
async function getEvents (req, res, next) {
  try {
    const location = req.query.location;
    let events = await getAllEvents();

    logger.info(asyncHooks.getRequestContext(), req.query);
    if (location) {
      events = events.filter(event => event.location === location);
    }
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// curl localhost:3000/events/2
async function getEvent (req, res, next) {
  try {
    const eventId = Number(req.params.eventId);
    logger.info(asyncHooks.getRequestContext(), req.params);

    const events = await getAllEvents(true)
    res.json(events[eventId]);
  } catch (err) {
    next(err);
  }
}

//  curl --request DELETE http://localhost:3000/events/3
async function deleteEvent (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.params);

    const eventId = Number(req.params.eventId);
    const events = await getAllEvents(true)

    delete events[eventId];
    await saveEventsToFile(Object.values(events));
    res.json({success: true});
  } catch (err) {
    next(err);
  }
}

// curl --request POST 'http://localhost:3000/events' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "id": 4,
//    "title": "meeting4",
//    "location": "dnepr",
//    "date": "12-12-2020",
//    "hour": "13:00"
// }'

async function createEvent (req, res, next) {
  try {
    const {id, title, location, date, hour} = req.body;
    logger.info(asyncHooks.getRequestContext(), req.body);

    const events = await getAllEvents();

    events.push({id, title, location, date, hour});
    await saveEventsToFile(events);

    res.json([{result: 'Event was added'}])
  } catch (err) {
    next(err);
  }
}

// curl --location --request PUT 'http://localhost:3000/events/3' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "id": 4,
//    "title": "meeting4",
//    "location": "dnepr",
//    "date": "12-12-2020",
//    "hour": "13:00"
// }'
async function updateEvent (req, res, next) {
  try {
    const {id, title, location, date, hour} = req.body;
    const eventId = Number(req.params.eventId);
    logger.info(asyncHooks.getRequestContext(), req.body, req.params);

    const events = await getAllEvents(true)

    if (events[eventId]) {
      events[eventId] = {id, title, location, date, hour};
      await saveEventsToFile(Object.values(events));
      res.json([{result: 'Event was updated'}])
    } else {
      res.statusCode = 404;
      res.json({error: 'Event not found'});
    }

  } catch (err) {
    next(err);
  }
}

// curl localhost:3000/events-batch
async function getEventsBatch (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext());
    const events = await getAllEvents();

    const streamEvents = stream.Readable.from(JSON.stringify(events));
    streamEvents.pipe(res);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEvents,
  getEvent,
  deleteEvent,
  createEvent,
  updateEvent,
  getEventsBatch
};
