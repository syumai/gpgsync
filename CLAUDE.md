# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

gpgsync is a collaborative real-time code editor based on The Go Playground. It allows multiple users to simultaneously edit Go code in shared rooms using Yjs for real-time collaboration and conflict-free collaborative editing.

**Live demo**: https://gpgsync.herokuapp.com

## Development Commands

### Running the Application
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start the development server (both Express and Yjs WebSocket servers)
node server.ts
# Express server runs on http://localhost:8080 (or PORT env var)
# Yjs WebSocket server runs on ws://localhost:1234/ws (or YJS_PORT env var)
```

### Frontend Development
```bash
# Build frontend for production
npm run build

# Build frontend for development with watch mode
npm run dev

# Serve frontend with webpack dev server
npm run serve
```

### Deployment
```bash
# Deploy to Heroku
make deploy
# This runs: git push heroku main
```

### Quality Checks
```bash
# Check server-side TypeScript compilation
npx tsc --noEmit

# Check client-side TypeScript compilation  
npx tsc --noEmit -p tsconfig.client.json
```

**Note**: The project currently has no automated testing, linting, or formatting tools configured. The package.json test script is a placeholder that exits with an error.

## Architecture

### Dual Server Architecture
The application runs two concurrent servers:

1. **Express Server** (`server.ts` → `app/server.ts`):
   - HTTP server with EJS templating
   - Static file serving from `public/`
   - Route handlers for home and room pages
   - Port: 8080 (default) or PORT environment variable

2. **Yjs WebSocket Server** (`app/yjs-websocket-server.ts`):
   - Real-time collaborative editing server
   - WebSocket-based communication using y-websocket
   - Port: 1234 (default) or YJS_PORT environment variable

### Request Flow
1. User accesses room URL via Express server
2. Client connects to Yjs WebSocket server for real-time collaboration  
3. Collaborative editing state synchronized via Yjs operations
4. Go code execution handled via @syumai/goplayground-node API

### Key URL Patterns
- `/` - Home page
- `/p/:sharedContentId` - Home with pre-loaded Go Playground content
- `/rooms/:roomId` - Collaborative room
- `/rooms/:roomId/p/:sharedContentId` - Room with pre-loaded content

### Project Structure
```
gpgsync/
├── server.ts              # Main server entry point
├── app/                   # Backend application code
│   ├── server.ts          # Express app configuration
│   ├── handlers.ts        # Route handlers
│   ├── middlewares.ts     # Express middleware
│   ├── validators.ts      # Input validation
│   └── yjs-websocket-server.ts # Yjs WebSocket server
├── web/                   # Frontend TypeScript code
│   └── room.ts           # Client-side room functionality
├── public/                # Static assets and webpack output
├── views/                 # EJS templates
├── webpack.config.js      # Frontend build configuration
└── package.json          # Dependencies and scripts
```

### Important Implementation Details

- **Collaboration Technology**: Uses Yjs instead of Socket.IO + ot.js for real-time collaboration
- **ES Modules**: Entire codebase uses ES modules with .ts file extensions in imports
- **TypeScript**: Strict mode with modern ES features, separate configs for server/client
- **State Management**: Collaboration state handled by Yjs (persistent in WebSocket server)
- **Room Lifecycle**: Rooms created on-demand, cleanup handled by Yjs server
- **Go Integration**: Uses `@syumai/goplayground-node` for shared content and code execution
- **Validation**: Input validation for room IDs and shared content IDs in `app/validators.ts`
- **Error Handling**: Centralized middleware in `app/middlewares.ts` with graceful shutdown

## Tech Stack

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express.js 5.x with EJS templating  
- **Real-time**: Yjs with y-websocket, ws WebSocket library
- **Go Integration**: @syumai/goplayground, @syumai/goplayground-node
- **Language**: TypeScript with ES modules

### Frontend  
- **Editor**: CodeMirror with y-codemirror for Yjs integration
- **Real-time**: Yjs client libraries (yjs, y-protocols, lib0)
- **Build**: Webpack 5 with TypeScript and Babel loaders
- **Language**: TypeScript (client-side configuration)

### Development
- **Package Manager**: pnpm
- **Build System**: Webpack with ts-loader, babel-loader
- **TypeScript**: Strict mode, separate server/client configurations
- **Deployment**: Heroku with git-based deployment

## Code Style Guidelines

- **ES Modules**: All files use `import`/`export` with `.ts` extensions in relative imports
- **Naming**: camelCase for variables/functions, PascalCase for classes, kebab-case for files
- **TypeScript**: Explicit type annotations, strict null checks enabled
- **Error Handling**: async/await preferred, centralized Express error middleware
- **Architecture**: Single responsibility principle, clear separation of concerns