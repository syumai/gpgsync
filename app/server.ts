const express = require("express");
const path = require("path");
const { homeHandler, roomHandler } = require("./handlers.ts");
const { invalidURIValidatorHandler, errorHandler } = require("./middlewares.ts");

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

module.exports = {
  app,
};
