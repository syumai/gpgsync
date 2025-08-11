# Architecture Details for gpgsync

## Core Architecture

### Real-Time Collaboration System
- **Operational Transformation (OT)**: Uses ot.js library for conflict-free collaborative editing
- **WebSocket Communication**: Socket.IO for real-time bidirectional communication
- **Room-Based Architecture**: Users join specific rooms identified by unique room IDs

### Key Components

#### 1. Server Layer (`app/server.js`)
- Express.js application setup
- Static file serving from `public/` directory
- EJS template engine configuration
- Socket.IO server integration
- Route registration and middleware setup

#### 2. Request Handlers (`app/handlers.js`)
- `homeHandler`: Serves the landing page
- `roomHandler`: Serves the collaborative room interface  
- `ioServerHandler`: Manages Socket.IO server lifecycle for rooms
- Integration with GoPlayground API for code execution

#### 3. Real-Time Editor (`lib/editor-socketio-server.js`)
- Manages operational transformation for collaborative editing
- Handles client connections and disconnections
- Synchronizes document state across all connected clients
- Maintains server-side document state

#### 4. Client-Side Assets
- **Public Assets**: CSS and JavaScript files for UI
- **Templates**: EJS templates for server-side rendering
- **Client-Side OT**: JavaScript implementation for real-time collaboration

### Data Flow

```
Client Browser
    ↓ HTTP Request (room creation/joining)
Express Server (app/server.js)
    ↓ Route handling
Request Handlers (app/handlers.js)
    ↓ Template rendering
EJS Templates (views/*.ejs)
    ↓ WebSocket connection
Socket.IO Server
    ↓ OT operations
Editor Server (lib/editor-socketio-server.js)
    ↓ Go code execution
GoPlayground API (@syumai/goplayground-node)
```

### Integration Points

#### Go Playground Integration
- Uses `@syumai/goplayground-node` package
- Supports shared content IDs from official Go Playground
- Allows importing and executing Go code
- URL format: `/rooms/:roomId/p/:sharedContentId`

#### Socket.IO Room Management
- Each collaborative session is a Socket.IO room
- Server maintains a map of active editor servers per room
- Automatic cleanup of inactive rooms
- Real-time synchronization of cursor positions and text changes

### Security Considerations
- Room ID validation to prevent injection attacks
- Input sanitization for shared content IDs
- Error boundaries to prevent server crashes
- No authentication system (open access model)

### Scalability Notes
- In-memory state storage (not persistent across restarts)
- Single-server deployment model
- Room-based horizontal partitioning possible
- No database layer - all state is ephemeral