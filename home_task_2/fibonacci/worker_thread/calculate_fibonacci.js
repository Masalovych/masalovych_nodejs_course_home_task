const http = require('http');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

if (isMainThread) {

  http.createServer((req, res) => {
    console.log('START: Count Fibonacci');
    const start = new Date();
    const worker = new Worker(__filename, {workerData: 45});

    worker.on('message', (message) => {
      res.writeHeader(200, { 'Content-Type': 'application/json' });
      res.end(`FINISH: Count Fibonacci in ${(new Date - start)/1000} seconds.\nResult: ${message}\n`);
    });
  }).listen(3000, () => console.log('Listening on port 3000'));

} else {
  const fibonacciRes = fibonacci(workerData);
  parentPort.postMessage(fibonacciRes);
}
