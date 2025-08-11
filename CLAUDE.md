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

# Start the development server (Cloudflare Workers with Wrangler)
npm run cf:dev
# or
make dev
# Application runs on http://localhost:8787 by default
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
# Deploy to Cloudflare Workers
make deploy
# This runs: npm run cf:deploy (which runs npm run build && wrangler deploy)

# Development deployment with Wrangler
npm run wrangler:dev

# Production deployment with Wrangler
npm run wrangler:deploy
```

### Quality Checks
```bash
# Check worker TypeScript compilation
npx tsc --noEmit -p tsconfig.worker.json

# Check client-side TypeScript compilation  
npx tsc --noEmit -p tsconfig.client.json

# Generate Wrangler types (for Cloudflare Workers)
npm run wrangler:types
```

**Note**: The project currently has no automated testing, linting, or formatting tools configured. The package.json test script is a placeholder that exits with an error.

## Architecture

### Cloudflare Workers Architecture
The application runs entirely on Cloudflare Workers with Durable Objects:

1. **Hono HTTP Server** (`src/worker.ts`):
   - HTTP server with HTML template rendering
   - Static asset serving via Cloudflare Workers ASSETS binding
   - Route handlers for home and room pages
   - Runs on Cloudflare's global edge network

2. **Durable Objects** (`src/gpgsync-durable-object.ts`):
   - Real-time collaborative editing using y-durableobjects
   - WebSocket-based communication with Yjs protocol
   - Persistent room state managed by Cloudflare
   - Automatic scaling and cleanup

### Request Flow
1. User accesses room URL via Cloudflare Workers
2. Static assets served from edge cache
3. WebSocket connections upgrade to Durable Objects for real-time collaboration
4. Collaborative editing state synchronized via Yjs operations stored in Durable Objects
5. Go code execution handled via direct Go Playground API calls

### Key URL Patterns
- `/` - Home page
- `/p/:sharedContentId` - Home with pre-loaded Go Playground content
- `/rooms/:roomId` - Collaborative room
- `/rooms/:roomId/p/:sharedContentId` - Room with pre-loaded content

### Project Structure
```
gpgsync/
├── src/                   # Cloudflare Workers code
│   ├── worker.ts          # Hono app entry point (main server)
│   ├── gpgsync-durable-object.ts # Durable Object for rooms
│   ├── validators.ts      # Input validation
│   └── templates.ts       # HTML templates
├── web/                   # Frontend TypeScript code
│   └── room.ts           # Client-side room functionality
├── public/                # Static assets and webpack output
├── wrangler.toml          # Cloudflare Workers configuration
├── webpack.config.js      # Frontend build configuration
├── tsconfig.worker.json   # Worker TypeScript configuration
├── tsconfig.client.json   # Client TypeScript configuration
└── package.json          # Dependencies and scripts
```

### Important Implementation Details

- **Collaboration Technology**: Uses Yjs with y-durableobjects for real-time collaboration
- **ES Modules**: Entire codebase uses ES modules with .ts file extensions in imports
- **TypeScript**: Strict mode with modern ES features, separate configs for worker/client
- **State Management**: Collaboration state handled by Yjs (persistent in Durable Objects)
- **Room Lifecycle**: Rooms created on-demand, cleanup handled automatically by Cloudflare
- **Go Integration**: Direct Go Playground API calls via fetch (no Node.js dependencies)
- **Validation**: Input validation for room IDs and shared content IDs in `src/validators.ts`
- **Error Handling**: Hono error handling middleware with proper HTTP responses

## Tech Stack

### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono with HTML templating
- **Real-time**: Yjs with y-durableobjects
- **Persistence**: Cloudflare Durable Objects
- **Go Integration**: @syumai/goplayground via direct API calls
- **Language**: TypeScript with ES modules

### Frontend  
- **Editor**: CodeMirror with y-codemirror for Yjs integration
- **Real-time**: Yjs client libraries (yjs, y-protocols, lib0)
- **Build**: Webpack 5 with TypeScript and Babel loaders
- **Language**: TypeScript (client-side configuration)

### Development
- **Package Manager**: pnpm
- **Build System**: Webpack with ts-loader, babel-loader
- **TypeScript**: Strict mode, separate worker/client configurations
- **Deployment**: Cloudflare Workers with Wrangler

## Code Style Guidelines

- **ES Modules**: All files use `import`/`export` with `.ts` extensions in relative imports
- **Naming**: camelCase for variables/functions, PascalCase for classes, kebab-case for files
- **TypeScript**: Explicit type annotations, strict null checks enabled
- **Error Handling**: async/await preferred, centralized Express error middleware
- **Architecture**: Single responsibility principle, clear separation of concerns