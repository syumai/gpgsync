const { server } = require("./app/server");

if (module === require.main) {
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log("Press Ctrl+C to quit.");
  });
}

module.exports = server;
