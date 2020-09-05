const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const EditorSocketIOServer = require("ot/lib/editor-socketio-server");

const app = express();
const httpServer = http.Server(app);
const io = socketio(httpServer);

app.use(express.static("public"));

const ioServer = new EditorSocketIOServer("", [], 1);

io.on("connection", (socket) => {
  ioServer.addClient(socket);
});

if (module === require.main) {
  const port = process.env.PORT || 8080;
  httpServer.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log("Press Ctrl+C to quit.");
  });
}

module.exports = httpServer;
