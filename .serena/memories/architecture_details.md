# Architecture Details

## Project Structure
```
gpgsync/
├── server.ts                    # Legacy Node.js server entry point
├── app/                         # Legacy Node.js backend code
│   ├── server.ts               # Express app configuration
│   ├── handlers.ts             # Route handlers
│   ├── middlewares.ts          # Express middleware
│   ├── validators.ts           # Input validation
│   ├── errors.ts               # Error definitions
│   └── yjs-websocket-server.ts # Yjs WebSocket server
├── src/                        # Cloudflare Workers code (current)
│   ├── worker.ts              # Hono app entry point  
│   ├── gpgsync-durable-object.ts # Durable Object for rooms
│   ├── validators.ts          # Input validation
│   └── templates.ts           # HTML templates
├── web/                       # Frontend TypeScript
│   └── room.ts               # Client-side room functionality
├── public/                   # Static assets and webpack output
├── views/                    # EJS templates (legacy)
├── webpack.config.js         # Frontend build configuration
├── wrangler.toml            # Cloudflare Workers config
├── tsconfig.json            # Server TypeScript config
├── tsconfig.client.json     # Client TypeScript config
└── tsconfig.worker.json     # Worker TypeScript config
```

## Dual Architecture System

### Current: Cloudflare Workers
- **Framework**: Hono for routing and middleware
- **Persistence**: Durable Objects for room state
- **Collaboration**: y-durableobjects for Yjs integration
- **Assets**: Static file serving via Workers
- **Deployment**: Wrangler-based deployment

### Legacy: Node.js Express
- **HTTP Server**: Express.js with EJS templating
- **WebSocket Server**: Separate Yjs WebSocket server
- **Ports**: 8080 (Express) + 8136 (Yjs WebSocket)
- **Deployment**: Heroku via git

## Request Flow

### Cloudflare Workers Flow
1. Request hits Cloudflare edge
2. Hono router handles HTTP requests
3. Durable Object manages room state
4. WebSocket upgrades for real-time collaboration
5. Static assets served from Workers

### Legacy Node.js Flow  
1. User accesses room via Express server
2. Client connects to separate Yjs WebSocket server
3. Collaborative editing via WebSocket protocol
4. Go code execution via API

## Key Components

### Room Management
- Room IDs validated in validators.ts
- Room state persisted in Durable Objects (current) or memory (legacy)
- On-demand room creation
- Automatic cleanup handled by platform

### Collaboration Engine
- **Technology**: Yjs (conflict-free replicated data types)
- **Transport**: WebSockets with y-websocket protocol
- **Editor Integration**: y-codemirror binding
- **Synchronization**: Automatic conflict resolution

### Go Integration
- **API**: @syumai/goplayground for shared content
- **Execution**: @syumai/goplayground-node for running code
- **Features**: Format, run, share functionality

## Configuration Files
- **wrangler.toml**: Cloudflare Workers deployment config
- **tsconfig.*.json**: TypeScript configurations for different targets
- **webpack.config.js**: Frontend build pipeline
- **package.json**: Dependencies and scripts
- **Procfile**: Heroku deployment configuration