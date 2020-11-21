const asyncHooks = require('../hooks');
const logger = require('../helpers/logger');

const db = require("../../db/models");
const { Op } = require("sequelize");
const User = db.User;
const Event = db.Event;

// curl localhost:3000/users?email=masalovych
async function getUsers (req, res, next) {
  try {
    const email = req.query.email;
    logger.info(asyncHooks.getRequestContext(), req.query);

    const options = {
      attributes: ['id', 'email', 'firstName']
    };
    if (email) {
      options.where = {
        location: {
          [Op.substring]: email
        }
      };
    }
    const users = await User.findAll(options);

    res.json({results: users});
  } catch (err) {
    next(err);
  }
}

// curl localhost:3000/users/2
async function getUser (req, res, next) {
  try {
    const userId = Number(req.params.userId);
    logger.info(asyncHooks.getRequestContext(), req.params);

    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'firstName']
    });
    if (!user) res.status(404)

    res.json(user);
  } catch (err) {
    next(err);
  }
}

//  curl --request DELETE http://localhost:3000/users/3
async function deleteUser (req, res, next) {
  const t = await db.sequelize.transaction();
  try {
    logger.info(asyncHooks.getRequestContext(), req.params);
    const userId = Number(req.params.userId);

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({error: 'not found'});

    // Destroy user events
    const deletedEventsCount = await Event.destroy({
      where: {
        ownerId: userId,
      },
      transaction: t
    })

    await user.destroy({ transaction: t });

    await t.commit();

    res.json({success: true, results: {
      message: `User and his ${deletedEventsCount} events ware deleted`
    }});
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// curl --request POST 'http://localhost:3000/users' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "firstName": "James",
//    "lastName": "Bond",
//    "email": "JamesBond@gmail.com"
// }'

async function createUser (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.body);
    const {firstName, lastName, email} = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (user) {
      return res.status(400).json({error: `Email address ${email} already exist`});
    }

    const [newUser] = await User.findOrCreate({
      where: {firstName, lastName, email}
    })

    res.json(newUser);
  } catch (err) {
    next(err);
  }
}

// curl --location --request PUT 'http://localhost:3000/users/3' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "id": 4,
//    "firstName": "James2",
//    "lastName": "Bond2",
//    "email": "BabaraLevy@gmail.com"
// }'
async function updateUser (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.body, req.params);
    const {firstName, lastName, email} = req.body;
    const userId = Number(req.params.userId);

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({error: 'not found'});

    if (user.email && user.email !== email) {
      const sameEmailUser = await User.findOne({where: { email }});
      if (sameEmailUser) return res.status(400).json({error: `Email address ${email} already exist`});
    }

    const updatedUser = await user.update({firstName, lastName, email});

    res.json({success: true, results: updatedUser});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser
};
