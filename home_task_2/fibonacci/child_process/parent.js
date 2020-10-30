const http = require('http');
const cp = require('child_process');

http.createServer((req, res) => {

  console.log('START: Count Fibonacci');
  const start = new Date();

  const childProcess = cp.fork(`${__dirname}/child.js`);

  childProcess.on('message', (message) => {
    if (message.result) {
      res.writeHeader(200, { 'Content-Type': 'application/json' });
      res.end(`FINISH: Count Fibonacci in ${(new Date - start)/1000} seconds.\nResult: ${message.result}\n`);
    }
  });

  childProcess.send({ fibonacciNum: 45 });

}).listen(3000, () => console.log('Listening on port 3000'));
