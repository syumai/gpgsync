# GPGSync Project Overview

## Purpose
GPGSync is a collaborative real-time code editor based on The Go Playground. It enables multiple users to simultaneously edit Go code in shared rooms using Yjs for real-time collaboration and conflict-free collaborative editing.

## Live Demo
https://gpgsync.syumai.workers.dev/

## Current Architecture
The project has fully migrated to Cloudflare Workers with Durable Objects for improved scalability and global distribution.

## Key Features
- Real-time collaborative Go code editing
- Shared rooms for multi-user sessions
- Integration with Go Playground for code execution
- WebSocket-based synchronization using Yjs
- Support for pre-loaded content via shared IDs

## Architecture
- **Platform**: Cloudflare Workers with Durable Objects
- **Framework**: Hono for HTTP routing and middleware
- **Collaboration**: Yjs-based CRDT for conflict-free editing using y-durableobjects
- **Frontend**: TypeScript with CodeMirror editor
- **Deployment**: Wrangler-based deployment to Cloudflare

## URL Patterns
- `/` - Home page
- `/p/:sharedContentId` - Home with pre-loaded Go Playground content
- `/rooms/:roomId` - Collaborative room
- `/rooms/:roomId/p/:sharedContentId` - Room with pre-loaded content