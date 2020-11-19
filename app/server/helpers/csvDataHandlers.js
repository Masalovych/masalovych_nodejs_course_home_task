const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const asyncHooks = require('../hooks');
const logger = require('../helpers/logger');

const dataFilePath = path.join(__dirname, '..', '..', 'data', 'events.csv');
const dataHeaders = ['id', 'title', 'location', 'date', 'hour'];

function getAllEvents(normalized) {
  logger.info(asyncHooks.getRequestContext());
  let events = [];
  return new Promise((resolve, reject) => {
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
      })
      .on('error', reject);
  });
}

function convertEventsToCsv(events) {
  return events.reduce((memo, event) => {
    memo += `${[event.id, event.title, event.location, event.date, event.hour].join(',')}\n`;
    return memo;
  }, '')
}

function saveEventsToFile(events) {
  return new Promise((resolve, reject) => {
    logger.info(asyncHooks.getRequestContext());

    const writeStream = fs.createWriteStream(dataFilePath);
    writeStream.write(convertEventsToCsv(events));
    writeStream.close();

    writeStream.on('close', resolve);
    writeStream.on('error', reject);
  });
}

module.exports = {
  getAllEvents,
  saveEventsToFile
};
