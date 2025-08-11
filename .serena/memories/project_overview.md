# Project Overview: gpgsync

## Purpose
gpgsync is "The Go Playground with coedit mode" - a collaborative, real-time code editor based on the official Go Playground. It allows multiple users to simultaneously edit Go code in shared rooms, providing a collaborative programming environment for Go development.

## Key Features
- Real-time collaborative editing using operational transformation (OT)
- Room-based collaboration system with unique room IDs
- Integration with Go Playground's shared content system
- Live Go code execution capabilities
- Web-based interface accessible through browsers

## Live Demo
- Production deployment: https://gpgsync.herokuapp.com
- Room access: `/rooms/:roomId`
- Shared content: `/p/:sharedContentId`
- Combined: `/rooms/:roomId/p/:sharedContentId`

## Tech Stack
- **Runtime**: Node.js (version 22.x)
- **Backend Framework**: Express.js (v5.1.0)
- **Real-time Communication**: Socket.IO (v4.8.1)
- **Template Engine**: EJS (v3.1.10)
- **Operational Transformation**: ot.js library
- **Go Integration**: @syumai/goplayground-node (v0.1.8)
- **Package Manager**: pnpm (based on pnpm-lock.yaml presence)

## Project Structure
```
├── app/                    # Core application logic
│   ├── server.js          # Express server setup and configuration
│   ├── handlers.js        # Route handlers for rooms and home
│   ├── middlewares.js     # Express middleware functions
│   ├── validators.js      # Request validation logic
│   ├── consts.js         # Application constants
│   └── errors.js         # Error handling utilities
├── lib/                   # Library modules
│   └── editor-socketio-server.js  # Socket.IO server for collaborative editing
├── views/                 # EJS templates
│   ├── home.ejs          # Landing page template
│   └── room.ejs          # Room interface template
├── public/               # Static assets (CSS, JavaScript)
│   ├── app.css, app.js   # Room interface assets
│   └── home.css, home.js # Landing page assets
├── server.js             # Application entry point
├── package.json          # Node.js dependencies and scripts
└── Makefile             # Deployment commands
```