# Technology Stack

## Runtime & Platform
- **Primary**: Cloudflare Workers (current deployment target)
- **Legacy**: Node.js 22.x 
- **Package Manager**: pnpm

## Backend Frameworks
- **Current**: Hono (Cloudflare Workers)
- **Legacy**: Express.js 5.x with EJS templating

## Real-time Collaboration
- **Core**: Yjs (conflict-free replicated data types)
- **Transport**: y-websocket, y-durableobjects
- **Protocols**: y-protocols, lib0
- **WebSocket**: ws library (Node.js version)

## Frontend
- **Editor**: CodeMirror with y-codemirror integration
- **Language**: TypeScript with strict mode
- **Build System**: Webpack 5
- **Loaders**: ts-loader, babel-loader
- **Babel**: @babel/core, @babel/preset-env

## Go Integration
- **API**: @syumai/goplayground, @syumai/goplayground-node
- **Execution**: Go Playground API integration

## Development Tools
- **TypeScript**: v5.9.2 with strict configuration
- **Configurations**: Separate tsconfig for server/client/worker
- **Module System**: ES modules with .ts extensions
- **Build Target**: ESNext with Node.js compatibility

## Deployment
- **Primary**: Cloudflare Workers via Wrangler
- **Legacy**: Heroku via git deployment
- **Assets**: Static file serving from public/ directory

## Dependencies Overview
- Yjs ecosystem for collaboration
- Hono for modern web framework
- TypeScript for type safety
- Webpack for frontend bundling
- Cloudflare Workers Types for deployment