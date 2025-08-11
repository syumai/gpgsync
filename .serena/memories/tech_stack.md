# Tech Stack

## Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono with HTML templating
- **Real-time**: Yjs with y-durableobjects
- **Persistence**: Cloudflare Durable Objects
- **Go Integration**: @syumai/goplayground via direct API calls
- **Language**: TypeScript with ES modules

## Frontend  
- **Editor**: CodeMirror with y-codemirror for Yjs integration
- **Real-time**: Yjs client libraries (yjs, y-protocols, lib0)
- **Build**: Webpack 5 with TypeScript and Babel loaders
- **Language**: TypeScript (client-side configuration)

## Development
- **Package Manager**: pnpm
- **Build System**: Webpack with ts-loader, babel-loader
- **TypeScript**: Strict mode, separate worker/client configurations
- **Deployment**: Cloudflare Workers with Wrangler

## Key Dependencies

### Production
- `@syumai/goplayground`: Go Playground integration
- `hono`: Web framework for Cloudflare Workers
- `lib0`: Low-level utilities for Yjs
- `y-codemirror`: CodeMirror binding for Yjs
- `y-durableobjects`: Yjs integration with Cloudflare Durable Objects
- `y-protocols`: Yjs networking protocols
- `yjs`: Conflict-free replicated data types

### Development
- `@cloudflare/workers-types`: TypeScript types for Workers
- `wrangler`: Cloudflare Workers CLI
- `webpack`: Module bundler
- `typescript`: TypeScript compiler
- Various loaders and build tools

## Removed Dependencies
The migration to Cloudflare Workers removed these Node.js dependencies:
- `express`: Web framework
- `ejs`: Template engine
- `ws`: WebSocket library
- `@syumai/goplayground-node`: Node.js-specific Go Playground client
- `@types/express`, `@types/ejs`, `@types/ws`: Type definitions