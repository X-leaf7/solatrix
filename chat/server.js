const http = require('http');
const socketServer = require("socket.io");
const clientSocket = require("./socket");

const httpServer = http.createServer((request, res) => {
  if (request.url === '/health/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      health: 'Up and running!'
    }));
  }
})

global.io = socketServer(httpServer, {
  cors: {
    origin: ["http://localhost", /\.split-side\.com$/ ],
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log('a user connected');
  const client = clientSocket(socket);
});

httpServer.listen(3000)