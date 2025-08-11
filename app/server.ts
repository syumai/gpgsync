import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { homeHandler, roomHandler } from "./handlers.ts";
import { invalidURIValidatorHandler, errorHandler } from "./middlewares.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "../public");

/***
 * Initialize server
 */
const app = express();

/***
 * Setup handlers
 */
app.set("view engine", "ejs");

app.use(invalidURIValidatorHandler);
app.use(express.static(publicPath));

app.get("/", homeHandler);
app.get("/p/:sharedContentId", homeHandler);
app.get("/rooms/:roomId/p/:sharedContentId", roomHandler);
app.get("/rooms/:roomId", roomHandler);

app.use(errorHandler);

export { app };
