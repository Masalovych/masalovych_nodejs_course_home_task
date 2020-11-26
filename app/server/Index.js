const express = require('express');
const bodyParser = require('body-parser');
const loginMethods = require('./login');
const usersMethods = require('./users');
const eventMethods = require('./events');
const userEventsMethods = require('./userEvents');
const logger = require('./helpers/logger');
const { PORT } = require('./config');
const asyncHooks = require('./hooks');
const { logErrors, clientErrorHandler, errorHandler } = require('./helpers/errorHandlers');
const app = express();

app.use((req, res, next) => {
  const data = { headers: req.headers};
  asyncHooks.createRequestContext(data);
  next();
});
app.use(bodyParser.json());

//login
app.post('/login', loginMethods.login);
app.post('/refreshTokens', loginMethods.refreshTokens);
app.post('/checkAccess', loginMethods.checkAccess);

// set user
app.use(loginMethods.loginMiddleware);

// users
app.get('/users', usersMethods.getUsers);
app.get('/users/:userId', usersMethods.getUser);
app.delete('/users/:userId', usersMethods.deleteUser);
app.post('/users', usersMethods.createUser);
app.put('/users/:userId', usersMethods.updateUser);

// events
app.get('/events', eventMethods.getEvents);
app.get('/events/:eventId', eventMethods.getEvent);
app.delete('/events/:eventId', eventMethods.deleteEvent);
app.post('/events', eventMethods.createEvent);
app.put('/events/:eventId', eventMethods.updateEvent);

// own and invited events
app.get('/users/:userId/ownEvents', userEventsMethods.getUserOwnEvents);
app.get('/users/:userId/invitedEvents', userEventsMethods.getUserInvitedEvents);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
});