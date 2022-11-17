const { Server } = require("socket.io");
const clientSocket = require("./socket");

global.io = new Server({
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  const client = clientSocket(socket);
});

io.listen(3000);