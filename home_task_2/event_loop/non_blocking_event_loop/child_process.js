const fs = require('fs');

const multiplier = 40;
const filePath = `${__dirname}/big_file_process_${process.pid}.txt`;

const readToFile = function (str) {
  fs.writeFile(filePath, str, () => {});
};

const createBigFile = function () {
  for(let i = 0; i < multiplier; i++) {
    readToFile('Long text. '.repeat(10000000) + '\n');
  }
};

createBigFile();

process.send({ status: 'success'});