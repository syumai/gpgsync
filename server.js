const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const EditorSocketIOServer = require("./lib/editor-socketio-server");
const { helloWorld } = require("./consts");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  maxHttpBufferSize: 1e6, // 1MB
});

app.use(express.static(__dirname + "/assets"));
app.use((req, res, next) => {
  let err;
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    err = e;
  }
  if (err) {
    console.error("Invalid URI parameter given");
    res.status(400).send("Invalid Argument");
    return;
  }
  next();
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  if (roomId.length > 20) {
    res
      .status(400)
      .send("Invalid Argument: Room ID is too long (must be <= 20)");
    return;
  }
  res.render(__dirname + "/views/room.ejs", { roomId });
});

const ioServerMap = new Map();

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const docId = data.docId;
    if (!docId) {
      return;
    }
    let ioServer = ioServerMap.get(docId);
    if (!ioServer) {
      ioServer = new EditorSocketIOServer(helloWorld, [], docId);
      ioServerMap.set(docId, ioServer);
    }
    ioServer.addClient(socket);
    ioServer.on("empty-room", () => {
      ioServerMap.delete(docId);
    });
  });
});

if (module === require.main) {
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log("Press Ctrl+C to quit.");
  });
}

module.exports = server;
