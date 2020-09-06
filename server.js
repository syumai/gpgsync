const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const EditorSocketIOServer = require("./lib/editor-socketio-server");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  maxHttpBufferSize: 1e6, // 1MB
});

app.use(express.static("public"));

const ioServerMap = new Map();

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const docId = data.docId;
    if (!docId) {
      return;
    }
    let ioServer = ioServerMap.get(docId);
    if (!ioServer) {
      ioServer = new EditorSocketIOServer("", [], docId);
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
