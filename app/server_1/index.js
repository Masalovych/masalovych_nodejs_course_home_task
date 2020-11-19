const http = require('http');

const {getAllEvents, saveEventsToFile} = require('../server/helpers/csvDataHandlers');
const logger = require('../server/helpers/logger');
const { PORT } = require('../server/config');

const paramsRegexp = /:[^/]+/g;
const getRouteRegexp = route => new RegExp(`^${route}$`.replace(paramsRegexp, '([^/]+)'));

function getRouteParams(matchedRoute, path) {
  const paramNames = (matchedRoute.match(paramsRegexp) || []).map(item => item.substring(1));
  return paramNames.length ? path.match(getRouteRegexp(matchedRoute))
  .slice(1)
  .reduce((res, val, idx) => (Object.assign(res, {[paramNames[idx]]: val})), {}) : {};
}

const getRequestBody = request => {
  return new Promise((resolve, reject) => {
    let bodyData = Buffer.from([]);
    request.on('data', data => bodyData = Buffer.concat([bodyData, data]));
    request.on('end', () => resolve(JSON.parse(bodyData.toString())));
    request.on('error', reject);
  });
}

const routes = {
  POST: new Map([
    ['/events', async (req, res, next) => {
      const {id, title, location, date, hour} = await getRequestBody(req);
      getAllEvents().then(events => {
        events.push({id, title, location, date, hour});
        saveEventsToFile(events);

        res.json([{result: 'Event was added'}])
      }).catch(next);
    }]
  ]),
  DELETE: new Map([
    ['/events/:eventId', (req, res, next) => {
      const eventId = Number(req.routeParams.eventId);
      if (Number.isInteger(eventId)) {
        getAllEvents(true).then(events => {
          delete events[eventId];
          saveEventsToFile(Object.values(events));
          res.json({success: true, message: 'Event was deleted!'});
        }).catch(next);
      } else {
        res.json({error: 'Invalid eventId'});
      }
    }]
  ])
};

http.createServer((req, res) => {
  const [path, queryParams] = req.url.split('?');
  const matchedRoutes = routes[req.method.toUpperCase()];

  const matchedRoute = [...matchedRoutes.keys()].find(route => {
    return getRouteRegexp(route).test(path);
  });

  const routeParams = getRouteParams(matchedRoute, path);
  Object.assign(req, {queryParams, routeParams});
  Object.assign(res, {json: function (json) {this.end(JSON.stringify(json))}});

  matchedRoutes.get(matchedRoute)(req, res);
}).listen(PORT, () => logger.info(`Listening on port ${PORT}...`));
