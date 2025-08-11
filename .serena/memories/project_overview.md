# gpgsync Project Overview

## Purpose
gpgsync is a collaborative real-time code editor based on The Go Playground. It allows multiple users to simultaneously edit Go code in shared rooms using Yjs for real-time collaboration. Users can create rooms, share Go Playground content, and collaborate on Go code with live execution capabilities.

**Live Demo**: https://gpgsync.herokuapp.com

## Key Features
- Multi-user real-time collaborative Go code editing
- Integration with The Go Playground for code execution, formatting, and sharing
- Room-based collaboration system
- Import shared content from official Go Playground using shared content IDs
- WebSocket-based real-time synchronization using Yjs

## Tech Stack
### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express.js 5.x with EJS templating
- **Real-time**: Yjs with WebSocket server (y-websocket, ws)
- **Go Integration**: @syumai/goplayground and @syumai/goplayground-node
- **Languages**: TypeScript (ES modules)

### Frontend
- **Editor**: CodeMirror with Yjs integration (y-codemirror)
- **Real-time**: Yjs client libraries
- **Build**: Webpack 5 with TypeScript and Babel
- **Languages**: TypeScript (client-side)

### Development Tools
- **Package Manager**: pnpm
- **Build System**: Webpack with ts-loader and babel-loader
- **TypeScript**: Strict mode with modern ES modules
- **Deployment**: Heroku with git-based deployment