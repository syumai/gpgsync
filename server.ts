import { app } from "./app/server.ts";
import { YjsWebSocketServer } from './lib/yjs-websocket-server.ts';

const expressPort = process.env.PORT || 8080;
const yjsPort = process.env.YJS_PORT ? parseInt(process.env.YJS_PORT) : 1234;

function createExpressServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(expressPort, () => {
      console.log(`Express server listening on port ${expressPort}`);
      resolve(server);
    });

    server.on('error', (error) => {
      console.error('Express server error:', error);
      reject(error);
    });
  });
}

async function createYjsServer() {
  const server = new YjsWebSocketServer(yjsPort);
  await server.start();
  console.log(`yjs WebSocket server listening on port ${yjsPort}`);
  console.log(`WebSocket URL: ws://localhost:${yjsPort}/ws`);
  return server;
}

function createShutdownPromise(server, serverType) {
  if (serverType === 'yjs') {
    return server.stop().catch(error => 
      console.error('Error stopping yjs server:', error)
    );
  }
  
  if (serverType === 'express') {
    return new Promise((resolve) => {
      server.close((error) => {
        if (error) {
          console.error('Error stopping Express server:', error);
        }
        resolve();
      });
    });
  }
  
  return Promise.resolve();
}

async function shutdownServers(servers, signal = 'SHUTDOWN') {
  console.log(`${signal} received, shutting down servers...`);
  
  const shutdownPromises = [
    servers.yjs && createShutdownPromise(servers.yjs, 'yjs'),
    servers.express && createShutdownPromise(servers.express, 'express')
  ].filter(Boolean);
  
  try {
    await Promise.all(shutdownPromises);
    console.log('All servers shut down gracefully');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
}

function setupGracefulShutdown(servers) {
  const handleShutdown = async (signal) => {
    await shutdownServers(servers, signal);
    process.exit(0);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdownServers(servers, 'UNCAUGHT_EXCEPTION').then(() => process.exit(1));
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdownServers(servers, 'UNHANDLED_REJECTION').then(() => process.exit(1));
  });
}

async function startServers() {
  console.log('Starting gpgsync servers...');
  
  try {
    // Start both servers concurrently and capture references
    const [yjsServer, expressServer] = await Promise.all([
      createYjsServer(),
      createExpressServer()
    ]);
    
    const servers = { yjs: yjsServer, express: expressServer };
    
    console.log('All servers started successfully');
    console.log(`Web interface: http://localhost:${expressPort}`);
    console.log('Press Ctrl+C to quit');
    
    setupGracefulShutdown(servers);
  } catch (error) {
    console.error('Failed to start servers:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServers();
}

export { app };
