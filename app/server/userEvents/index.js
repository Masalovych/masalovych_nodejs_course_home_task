const asyncHooks = require('../hooks');
const logger = require('../helpers/logger');

const db = require("../../db/models");
const User = db.User;

// curl localhost:3000/users/16/ownEvents
async function getUserOwnEvents (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.params);
    const userId = Number(req.params.userId);

    const user = await User.findByPk(userId);
    if(user) {
      const events = await user.getCreatedEvents();
      res.json({results: events});
    } else {
      res.status(404).json({error: 'not found'});
    }
  } catch (err) {
    next(err);
  }
}

// curl localhost:3000/users/16/invitedEvents
async function getUserInvitedEvents (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.params);
    const userId = Number(req.params.userId);

    const user = await User.findByPk(userId);
    if(user) {
      const events = await user.getInvitedEvents();
      res.json({results: events});
    } else {
      res.status(404).json({error: 'not found'});
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserOwnEvents,
  getUserInvitedEvents
};
