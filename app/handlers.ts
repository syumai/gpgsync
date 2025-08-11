import type { Request, Response } from "express";
import type { Socket } from "socket.io";
const path = require("path");
const EditorSocketIOServer = require("../lib/editor-socketio-server.ts");
const { helloWorld } = require("./consts.ts");
const { GoPlayground } = require("@syumai/goplayground-node");
const {
  validateRoomId,
  validateSharedContentIdLength,
} = require("./validators.ts");

const gp = new GoPlayground();
const viewRootPath = path.join(__dirname, "../views");

const homeHandler = (req: Request, res: Response): void => {
  const { sharedContentId } = req.params;
  if (sharedContentId) {
    validateSharedContentIdLength(sharedContentId);
  }
  res.render(viewRootPath + "/home.ejs", {
    sharedContentId: sharedContentId || "",
  });
};

const roomHandler = (req: Request, res: Response): void => {
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

const ioServerMap = new Map<string, any>();

const ioServerHandler = (socket: Socket): void => {
  socket.on("join", async (data: any) => {
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
