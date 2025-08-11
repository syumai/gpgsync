# gpgsync

A collaborative real-time code editor based on The Go Playground. Allows multiple users to simultaneously edit Go code in shared rooms using Yjs for real-time collaboration.

## Demo

https://gpgsync.herokuapp.com

### Features

```console
# Open room
https://gpgsync.herokuapp.com/rooms/:roomId

# Use shared content to create room
https://gpgsync.herokuapp.com/p/:sharedContentId

# Open room with shared content
https://gpgsync.herokuapp.com/rooms/:roomId/p/:sharedContentId
```

* shared content ID can be gotten by Go Playground's `share` function.
  - example: https://gpgsync.herokuapp.com/rooms/exampleRoom/p/xXqRTAb2hu7

## Usage

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start the development server (both Express and Yjs WebSocket servers)
node server.ts
# Express server runs on http://localhost:8080 (or PORT env var)
# Yjs WebSocket server runs on ws://localhost:8136 (or YJS_PORT env var)
```

### Development Commands

```bash
# Build frontend for production
npm run build

# Build frontend for development with watch mode
npm run dev

# Check TypeScript compilation
npx tsc --noEmit                    # Server-side
npx tsc --noEmit -p tsconfig.client.json  # Client-side
```

## Tech Stack

### Backend
* **Runtime**: Node.js 22.x
* **Framework**: Express.js 5.x with EJS templating
* **Real-time**: Yjs with y-websocket, WebSocket (ws library)
* **Go Integration**: [@syumai/goplayground](https://github.com/syumai/goplayground-js), [@syumai/goplayground-node](https://www.npmjs.com/package/@syumai/goplayground-node)
* **Language**: TypeScript with ES modules

### Frontend
* **Editor**: CodeMirror with y-codemirror for Yjs integration
* **Real-time**: Yjs client libraries (yjs, y-protocols, lib0)
* **Build**: Webpack 5 with TypeScript and Babel loaders
* **Language**: TypeScript

## Architecture

The application runs two concurrent servers:

1. **Express Server**: HTTP server with EJS templating and static file serving
2. **Yjs WebSocket Server**: Real-time collaborative editing server using WebSocket

Collaborative editing is powered by Yjs for conflict-free replicated data types (CRDTs), providing superior real-time collaboration compared to operational transformation approaches.

## References

* Original `The Go Playground` by Go team
  - https://play.golang.org/
* [Yjs](https://github.com/yjs/yjs) - Shared data types for building collaborative software
* Base Idea from ttakuru88: https://github.com/ttakuru88/ot_sample
  - Blog: https://kray.jp/blog/algorithm-operational-transformation/

## Author

syumai

## LICENSE

MIT
