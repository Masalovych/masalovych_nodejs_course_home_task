const http = require('http');

const options = {
  host: '127.0.0.1',
  port: 8000,
  path: ''
};

const processIdRequestCountsMap = {};

const processResBody = function(bodyJson) {
   const body = JSON.parse(bodyJson);

   if (body.processId) {
      if (processIdRequestCountsMap[body.processId]) processIdRequestCountsMap[body.processId] += 1;
      else processIdRequestCountsMap[body.processId] = 1;
   }
}

for (let i = 1; i <= 500; i++) {
  http.get(options, function(res) {
    res.on("data", function(chunk) {
      processResBody(chunk);
      console.dir(processIdRequestCountsMap);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

//  Output
//
//  500 requests
//
//     Numbers                  %
//–––––––––––––––––––––––––––––––––––––––
//    '9198': 66,         '9198': 13.20 %
//    '9199': 63,         '9199': 12.60 %
//    '9200': 61,         '9200': 12.20 %
//    '9201': 59,         '9201': 11.80 %
//    '9202': 64,         '9202': 12.80 %
//    '9203': 61,         '9203': 12.20 %
//    '9204': 65,         '9204': 13.00 %
//    '9205': 61          '9205': 12.20 %
//
