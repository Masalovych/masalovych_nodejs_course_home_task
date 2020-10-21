const http = require('http');

const logger = require('./logger');
const { PORT, ENV } = require('./config');

http.createServer((req, res) => {
    res.writeHeader(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello world!' }));
}).listen(PORT, () => logger.log(`Listening on port ${PORT}, Environment: ${ENV}`));
