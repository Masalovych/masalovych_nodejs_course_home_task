const asyncHooks = require('../hooks');
const logger = require('../helpers/logger');

const db = require("../../db/models");
const { Op } = require("sequelize");
const User = db.User;

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
  try {
    logger.info(asyncHooks.getRequestContext(), req.params);
    const userId = Number(req.params.userId);

    const deletedCount = await User.destroy({where: {id: userId}});
    if (!deletedCount) return  res.status(404).json({error: 'not found'});

    res.json({success: true});
  } catch (err) {
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

    const [user] = await User.findOrCreate({
      where: {firstName, lastName, email}
    })

    res.json(user);
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
//    "email": "James2Bond2@gmail.com"
// }'
async function updateUser (req, res, next) {
  try {
    logger.info(asyncHooks.getRequestContext(), req.body, req.params);
    const {firstName, lastName, email} = req.body;
    const userId = Number(req.params.userId);

    const [updatedCount] = await User.update({
      firstName, lastName, email
    }, {
      where: {
        id: userId
      }
    });
    if (!updatedCount) return res.status(404).json({error: 'not found'});

    res.json({success: true});
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
