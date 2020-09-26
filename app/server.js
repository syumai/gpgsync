const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { homeHandler, roomHandler, ioServerHandler } = require("./handlers");
const { invalidURIValidatorHandler, errorHandler } = require("./middlewares");

/***
 * Initialize server
 */
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  maxHttpBufferSize: 1e6, // 1MB
});

/***
 * Setup handlers
 */
app.set("view engine", "ejs");

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.use(invalidURIValidatorHandler);
app.use(errorHandler);

app.get("/", homeHandler);
app.get("/p/:sharedContentId", homeHandler);
app.get("/rooms/:roomId/p/:sharedContentId", roomHandler);
app.get("/rooms/:roomId", roomHandler);

io.on("connection", ioServerHandler);

module.exports = {
  server,
};
