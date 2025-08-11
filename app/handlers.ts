import type { Request, Response } from "express";
const path = require("path");
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

module.exports = {
  homeHandler,
  roomHandler,
};
