# Architecture Details

## Project Structure
```
gpgsync/
├── server.ts                 # Main server entry point
├── app/                      # Backend application code
│   ├── server.ts            # Express app configuration
│   ├── handlers.ts          # Route handlers (home, room)
│   ├── middlewares.ts       # Express middleware
│   ├── validators.ts        # Input validation
│   ├── errors.ts           # Error definitions
│   ├── consts.ts           # Constants
│   └── yjs-websocket-server.ts # Yjs WebSocket server
├── web/                     # Frontend TypeScript code
│   └── room.ts             # Client-side room functionality
├── public/                  # Static assets
├── views/                   # EJS templates
├── webpack.config.js        # Frontend build configuration
├── tsconfig.json           # Server-side TypeScript config
├── tsconfig.client.json    # Client-side TypeScript config
└── package.json            # Dependencies and scripts
```

## Server Architecture
The application runs two servers concurrently:

### 1. Express Server (HTTP)
- **Port**: 8080 (default) or PORT env var
- **Purpose**: Serves web interface and handles HTTP routes
- **Routes**:
  - `/` - Home page
  - `/p/:sharedContentId` - Home with pre-loaded Go Playground content
  - `/rooms/:roomId` - Collaborative room
  - `/rooms/:roomId/p/:sharedContentId` - Room with pre-loaded content

### 2. Yjs WebSocket Server
- **Port**: 1234 (default) or YJS_PORT env var  
- **Purpose**: Handles real-time collaborative editing
- **Technology**: y-websocket with custom YjsWebSocketServer class

## Request Flow
1. User accesses room URL via Express server
2. Client connects to Yjs WebSocket server for real-time collaboration
3. Collaborative editing state synchronized via Yjs operations
4. Go code execution handled via @syumai/goplayground-node API

## Key Design Patterns
- **ES Modules**: Entire codebase uses ES modules with .ts extensions
- **Dual Server Architecture**: Separate HTTP and WebSocket servers
- **TypeScript**: Strict typing throughout with modern features
- **Graceful Shutdown**: Proper cleanup handling for both servers
- **Error Handling**: Centralized middleware for HTTP errors