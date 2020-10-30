// Block process for 13 seconds
function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

process.on('message', (message) => {
  const fibonacciRes = fibonacci(message.fibonacciNum);
  process.send({ result: fibonacciRes });
});
