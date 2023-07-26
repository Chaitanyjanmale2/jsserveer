const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connectedUsers = [];

wss.on('connection', (ws, req) => {
  console.log(ws, req)
  const ip = req.connection.remoteAddress;
  connectedUsers.push({ ws, ip });

  ws.on('close', () => {
    const index = connectedUsers.findIndex(user => user.ws === ws);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
  });
});

app.get('/connected-users', (req, res) => {

  res.json(connectedUsers.map(user => user.ip));
});
app.get('/', (req, res) => {

  return res.send('Hello, this is the first page load. WebSocket connections will appear here once established.');


  // Return your regular response for the root path here
  res.send('Welcome to my server!'); // Modify this to your desired response
});
const port = 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
