const stream = require('stream');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const dataFilePath = path.join(__dirname, '..', '..', 'data', 'events.csv');
const dataHeaders = ['id', 'title', 'location', 'date', 'hour'];

function getAllEvents(normalized) {
  let events = [];
  return new Promise((resolve) => {
    fs.createReadStream(dataFilePath)
      .pipe(csv(dataHeaders))
      .on('data', data => events.push(data))
      .on('end', () => {
        if (normalized) {
          events = events.reduce((memo, event) => {
            memo[event.id] = event;
            return memo;
          }, {});
        }
        resolve(events);
      });
  });
}

function convertEventsToCsv(events) {
  return events.reduce((memo, event) => {
    memo += `${[event.id, event.title, event.location, event.date, event.hour].join(',')}\n`;
    return memo;
  }, '')
}

function saveEventsToFile(events) {
  fs.writeFileSync(dataFilePath, convertEventsToCsv(events));
}

// Handlers

// curl localhost:3000/events?location=lviv
async function getEvents (req, res) {
  const location = req.query.location;
  getAllEvents().then(events => {
    if (location) {
      events = events.filter(event => event.location === location);
    }
    res.json(events);
  });
}

// curl localhost:3000/events/2
async function getEvent (req, res) {
  const eventId = Number(req.params.eventId);
  if (Number.isInteger(eventId)) {
    getAllEvents(true).then(events => {
      res.json(events[eventId]);
    });
  } else {
    res.json({error: 'invalid param'});
  }
}

//  curl --request DELETE http://localhost:3000/events/3
async function deleteEvent (req, res) {
  const eventId = Number(req.params.eventId);

  if (Number.isInteger(eventId)) {
    getAllEvents(true).then(events => {
      delete events[eventId];
      saveEventsToFile(Object.values(events));
      res.json({success: true});
    });
  } else {
    res.json({error: 'invalid param'});
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

async function createEvent (req, res) {
  const {id, title, location, date, hour} = req.body;

  getAllEvents().then(events => {
    events.push({id, title, location, date, hour});
    saveEventsToFile(events);

    res.json([{result: 'Event was added'}])
  });
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
async function updateEvent (req, res) {
  const {id, title, location, date, hour} = req.body;
  const eventId = Number(req.params.eventId);

  getAllEvents(true).then(events => {
    if (events[eventId]) {
      events[eventId] = {id, title, location, date, hour};
      saveEventsToFile(Object.values(events));
      res.json([{result: 'Event was updated'}])
    } else {
      res.json({error: 'event not found'});
    }
  });
}

// curl localhost:3000/events-batch
async function getEventsBatch (req, res) {
  getAllEvents().then(events => {
    const streamEvents = stream.Readable.from(JSON.stringify(events));
    streamEvents.pipe(res);
  });
}

module.exports = {
  getEvents,
  getEvent,
  deleteEvent,
  createEvent,
  updateEvent,
  getEventsBatch
};
