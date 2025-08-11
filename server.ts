const { app } = require("./app/server.ts");

if (module === require.main) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
    console.log("yjs WebSocket server should be started separately on port 1234");
    console.log("Press Ctrl+C to quit.");
  });
}

module.exports = app;
