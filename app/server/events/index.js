const asyncHooks = require('../hooks');
const logger = require('../helpers/logger');

const db = require("../../db/models");
const { Op } = require("sequelize");
const Event = db.Event;
const User = db.User;

// curl localhost:3000/events?location=lviv
async function getEvents (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.query);
    const location = req.query.location;

    const options = {
      attributes: ['id', 'title', 'date', 'location', 'ownerId'],
      include: [{
        model: User,
        as: 'participants',
        attributes: ['firstName', 'lastName', 'email']
      }]
    };

    if (location) {
      options.where = {
        location: {
          [Op.eq]: location
        }
      };
    }

    const events = await Event.findAll(options);

    res.json({results: events});
  } catch (err) {
    next(err);
  }
}

// curl localhost:3000/events/2
async function getEvent (req, res, next) {
  try {
    const eventId = Number(req.params.eventId);
    logger.info(asyncHooks.getRequestContext(), req.params);

    const event = await Event.findOne({
      where: {
        id: eventId
      },
      attributes: ['id', 'title', 'date', 'location', 'ownerId'],
      include: [{
        model: User,
        as: 'participants',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    if (!event) res.status(404)

    res.json({results: event});
  } catch (err) {
    next(err);
  }
}

//  curl --request DELETE http://localhost:3000/events/3
async function deleteEvent (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.params);
    const eventId = Number(req.params.eventId);

    const deletedCount = await Event.destroy({where: {id: eventId}});
    if (!deletedCount) return  res.status(404).json({error: 'not found'});

    res.json({success: true});
  } catch (err) {
    next(err);
  }
}

// curl --request POST 'http://localhost:3000/events' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "title": "meeting4",
//    "location": "dnepr",
//    "date": "12-12-2020",
//    "ownerId": 16
// }'

async function createEvent (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.body);
    const {title, location, date, ownerId} = req.body;

    const owner = await User.findByPk(ownerId, {
      attributes: ['id', 'email', 'firstName']
    });

    if (owner) {
      const event = await Event.create({
        title, location, date: new Date(date), ownerId
      })
      res.json({results: event});
    } else {
      res.status(400).json({error: 'Bad request parameters: Owner is not found'});
    }
  } catch (err) {
    next(err);
  }
}

// curl --location --request PUT 'http://localhost:3000/events/3' \
// --header 'Content-Type: application/json' \
// --data-raw '{
// "title": "meeting4",
//   "location": "dnepr",
//   "date": "12-12-2020",
//   "ownerId": 16
// }'
async function updateEvent (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.body, req.params);
    const {title, location, date} = req.body;
    const eventId = Number(req.params.eventId);

    const [updatedCount] = await Event.update({
      title, location, date: new Date(date)
    }, {
      where: {
        id: eventId
      }
    });
    if (!updatedCount) return res.status(404).json({error: 'events not found'});

    res.json({success: true});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEvents,
  getEvent,
  deleteEvent,
  createEvent,
  updateEvent
};
