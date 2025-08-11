import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { helloWorld } from "./consts.ts";
import { GoPlayground } from "@syumai/goplayground-node";
import {
  validateRoomId,
  validateSharedContentIdLength,
} from "./validators.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export {
  homeHandler,
  roomHandler,
};
