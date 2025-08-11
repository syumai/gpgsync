const path = require("path");
const EditorSocketIOServer = require("../lib/editor-socketio-server");
const { helloWorld } = require("./consts");
const { GoPlayground } = require("@syumai/goplayground-node");
const {
  validateRoomId,
  validateSharedContentIdLength,
} = require("./validators");

const gp = new GoPlayground();
const viewRootPath = path.join(__dirname, "../views");

const homeHandler = (req, res) => {
  const { sharedContentId } = req.params;
  if (sharedContentId) {
    validateSharedContentIdLength(sharedContentId);
  }
  res.render(viewRootPath + "/home.ejs", {
    sharedContentId: sharedContentId || "",
  });
};

const roomHandler = (req, res) => {
  const { roomId, sharedContentId } = req.params;
  validateRoomId(roomId);
  if (sharedContentId) {
    validateSharedContentIdLength(sharedContentId);
  }
  res.render(viewRootPath + "/room.ejs", {
    roomId,
    sharedContentId: sharedContentId || "",
  });
};

const ioServerMap = new Map();

const ioServerHandler = (socket) => {
  socket.on("join", async (data) => {
    const { docId, sharedContentId } = data;
    if (!docId) {
      return;
    }
    let ioServer = ioServerMap.get(docId);
    if (!ioServer) {
      let initialContent = helloWorld;
      if (sharedContentId) {
        initialContent = await gp.download(sharedContentId);
      }
      ioServer = new EditorSocketIOServer(initialContent, [], docId);
      ioServer.setMaxListeners(50);
      ioServerMap.set(docId, ioServer);
    }
    ioServer.addClient(socket);
    ioServer.on("empty-room", () => {
      ioServerMap.delete(docId);
    });
  });
};

module.exports = {
  homeHandler,
  roomHandler,
  ioServerHandler,
};
