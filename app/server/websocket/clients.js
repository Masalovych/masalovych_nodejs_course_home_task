const { v4 } = require('uuid');

class Clients {
  constructor() {
    this.clients = {};
  }

  addClient(connection) {
    const clientId = v4();
    this.clients[clientId] = connection;
    connection.clientId = clientId;
    connection.on('close', this.removeClient.bind(this, connection));
  }

  removeClient(connection) {
    delete this.clients[connection.clientId];
  }

  getAllClients() {
    return Object.values(this.clients);
  }
}

module.exports = Clients;