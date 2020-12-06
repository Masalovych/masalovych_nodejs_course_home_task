const WebSocketServer = require('websocket').server;
const http = require('http');
const Clients = require('./clients');
const fs = require("fs");
const path = require("path");
const { v4 } = require('uuid');

const httpServer = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
httpServer.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
  httpServer,
  maxReceivedFrameSize: 131072,
  maxReceivedMessageSize: 10 * 1024 * 1024,
  autoAcceptConnections: false
});

const clients = new Clients();

function originIsAllowed(origin) {
  return origin.includes('http://localhost');
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  const connection = request.accept(null, request.origin);
  clients.addClient(connection);

  connection.on('message', async message => {
    if (message.type === 'utf8') {
      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      try {
        const fileName = v4();
        const filePath = path.join(__dirname, 'data', fileName);

        await fs.writeFile(filePath, message.binaryData, 'binary', function (err) {
          if(err) console.error('Error: ', err);
        });

        clients.getAllClients().forEach(client => {
          client.sendUTF('file:///' + filePath);
        })
      } catch (e) {
        console.log(e);
      }
    }
  });
});