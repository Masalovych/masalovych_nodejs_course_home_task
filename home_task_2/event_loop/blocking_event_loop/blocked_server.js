const http = require('http');
const fs = require('fs');

const multiplier = 40;

const readToFile = function (str) {
  fs.writeFile(`${__dirname}/big_file.txt`, str, () => {} );
};

const createBigFile = function () {
  for(let i = 0; i < multiplier; i++) {
    readToFile('Long text. '.repeat(10000000) + '\n');
  }
};

http.createServer((req, res) => {

  console.log('START: Big file created');
  const start = new Date();
  createBigFile();
  console.log(`FINISH: Big file creation in ${(new Date - start)/1000} seconds`);

  res.writeHeader(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'done' }));

}).listen(3000, () => console.log('Listening on port 3000'));
