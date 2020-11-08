const http = require('http');
const cp = require('child_process');

http.createServer((req, res) => {

  console.log('START: Big file created');
  const start = new Date();
  const childProcess = cp.fork(`${__dirname}/child_process.js`);

  childProcess.on('message', (message) => {
    if (message.status === 'success') {
      console.log(`FINISH: Big file creation in ${(new Date - start)/1000} seconds`);
      res.writeHeader(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'done' }));
    }
  });
}).listen(3000, () => console.log('Listening on port 3000'));
