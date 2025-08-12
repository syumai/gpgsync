# Architecture Details

## Project Structure
```
gpsync/
├── src/                        # Cloudflare Workers code
│   ├── worker.ts              # Hono app entry point  
│   ├── gpsync-durable-object.ts # Durable Object for rooms
│   ├── validators.ts          # Input validation
│   └── templates.ts           # HTML templates
├── web/                       # Frontend TypeScript
│   └── room.ts               # Client-side room functionality
├── public/                   # Static assets and webpack output
├── webpack.config.js         # Frontend build configuration
├── wrangler.toml            # Cloudflare Workers config
├── tsconfig.json            # Server TypeScript config
├── tsconfig.client.json     # Client TypeScript config
├── tsconfig.worker.json     # Worker TypeScript config
└── package.json             # Dependencies and scripts
```

## Cloudflare Workers Architecture

### HTTP Server (src/worker.ts)
- **Framework**: Hono for routing and middleware
- **Assets**: Static file serving via Cloudflare Workers ASSETS binding
- **Deployment**: Global distribution via Cloudflare edge network
- **Templates**: HTML template rendering (replacing EJS)

### Durable Objects (src/gpsync-durable-object.ts)
- **Persistence**: Room state managed by Cloudflare Durable Objects
- **Collaboration**: y-durableobjects for Yjs integration
- **Transport**: WebSocket upgrades for real-time collaboration
- **Lifecycle**: Automatic room creation and cleanup

## Request Flow

### Cloudflare Workers Flow
1. Request hits Cloudflare edge
2. Hono router handles HTTP requests
3. Durable Object manages room state
4. WebSocket upgrades for real-time collaboration
5. Static assets served from Workers

## Key Components

### Room Management
- Room IDs validated in src/validators.ts
- Room state persisted in Durable Objects
- On-demand room creation
- Automatic cleanup handled by Cloudflare

### Collaboration Engine
- **Technology**: Yjs (conflict-free replicated data types)
- **Transport**: WebSockets with y-durableobjects
- **Editor Integration**: y-codemirror binding
- **Synchronization**: Automatic conflict resolution

### Go Integration
- **API**: @syumai/goplayground for shared content metadata
- **Execution**: Direct Go Playground API calls via fetch
- **Features**: Format, run, share functionality

## Configuration Files
- **wrangler.toml**: Cloudflare Workers deployment config
- **tsconfig.*.json**: TypeScript configurations for different targets
- **webpack.config.js**: Frontend build pipeline
- **package.json**: Dependencies and scripts