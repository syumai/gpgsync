# GPGSync Project Overview

## Purpose
GPGSync is a collaborative real-time code editor based on The Go Playground. It enables multiple users to simultaneously edit Go code in shared rooms using Yjs for real-time collaboration and conflict-free collaborative editing.

## Live Demo
https://gpgsync.herokuapp.com

## Current Deployment
The project has migrated from a Node.js Express + WebSocket architecture to Cloudflare Workers with Durable Objects for improved scalability and global distribution.

## Key Features
- Real-time collaborative Go code editing
- Shared rooms for multi-user sessions
- Integration with Go Playground for code execution
- WebSocket-based synchronization using Yjs
- Support for pre-loaded content via shared IDs

## Architecture Evolution
The project is in transition:
- **Legacy**: Node.js Express server + separate Yjs WebSocket server
- **Current**: Cloudflare Workers with Durable Objects using Hono framework
- **Collaboration**: Yjs-based CRDT for conflict-free editing
- **Frontend**: TypeScript with CodeMirror editor

## URL Patterns
- `/` - Home page
- `/p/:sharedContentId` - Home with pre-loaded Go Playground content
- `/rooms/:roomId` - Collaborative room
- `/rooms/:roomId/p/:sharedContentId` - Room with pre-loaded content