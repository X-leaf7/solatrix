const http = require('http');
const socketServer = require("socket.io");
const clientSocket = require("./socket");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const Sentry = require("@sentry/node");

if (!process.env.DEBUG) {
  Sentry.init({
    dsn: "https://3ee5eb0326e78dc26947adb339205e9f@o4505767321272320.ingest.sentry.io/4505863526219776",
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

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
    origin: ["http://localhost", /\.split-side\.com$/, "https://split-side.com" ],
    methods: ["GET", "POST"]
  }
})

// Use the redis cache to make sure nodes communicate with each other
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  const client = clientSocket(socket);
});

httpServer.listen(3000)