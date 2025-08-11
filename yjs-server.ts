const { YjsWebSocketServer } = require('./lib/yjs-websocket-server.ts');

const port = process.env.YJS_PORT ? parseInt(process.env.YJS_PORT) : 1234;
const server = new YjsWebSocketServer(port);

async function start() {
  try {
    await server.start();
    console.log('yjs WebSocket server is running');
  } catch (error) {
    console.error('Failed to start yjs WebSocket server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down yjs WebSocket server');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down yjs WebSocket server');
  await server.stop();
  process.exit(0);
});

start();