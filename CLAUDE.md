# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

gpgsync is a collaborative real-time code editor based on The Go Playground. It allows multiple users to simultaneously edit Go code in shared rooms using operational transformation (OT) for conflict-free collaboration.

**Live demo**: https://gpgsync.herokuapp.com

## Development Commands

### Running the Application
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start the development server
node server.js
# Runs on http://localhost:8080 (or PORT environment variable)
```

### Deployment
```bash
# Deploy to Heroku
make deploy
# This runs: git push heroku main
```

**Note**: The project currently has no testing, linting, or formatting commands configured. The package.json test script is a placeholder that exits with an error.

## Architecture

### Core Components

**Server Setup** (`app/server.js`):
- Express.js server with EJS templating
- Socket.IO integration with 1MB buffer limit
- Static file serving from `public/`
- Route handlers for home and room pages

**Request Flow**:
1. `app/handlers.js` - Route handlers for home/room pages and Socket.IO connections
2. `lib/editor-socketio-server.js` - Operational Transformation server extending ot.js Server class
3. `@syumai/goplayground-node` - Go Playground API integration for code execution

**Real-time Collaboration**:
- Each room creates an `EditorSocketIOServer` instance that manages OT operations
- Server maintains a Map of active rooms (`ioServerMap`)
- Automatic cleanup when rooms become empty
- Supports importing shared content from official Go Playground using shared content IDs

### Key URL Patterns
- `/` - Home page
- `/p/:sharedContentId` - Home with pre-loaded Go Playground content
- `/rooms/:roomId` - Collaborative room
- `/rooms/:roomId/p/:sharedContentId` - Room with pre-loaded content

### Data Flow
```
Client connects → Socket.IO room join → EditorSocketIOServer creation/retrieval → 
OT operations sync → Go code execution via GoPlayground API
```

### Important Implementation Details

- **State Management**: All collaboration state is in-memory (not persistent across restarts)
- **Room Lifecycle**: Rooms are created on-demand and cleaned up automatically when empty
- **Go Integration**: Uses `@syumai/goplayground-node` to download shared content and execute code
- **Validation**: Input validation for room IDs and shared content IDs in `app/validators.js`
- **Error Handling**: Centralized error handling middleware in `app/middlewares.js`

## Tech Stack
- Node.js 22.x with Express.js
- Socket.IO for real-time communication  
- ot.js for operational transformation
- EJS for server-side templating
- @syumai/goplayground-node for Go integration