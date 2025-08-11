# Development Commands

## Package Management
```bash
# Install dependencies
pnpm install
```

## Development Servers

### Cloudflare Workers (Current/Preferred)
```bash
# Start development server with Wrangler
npm run wrangler:dev
# or with build
npm run cf:dev

# Deploy to Cloudflare
npm run cf:deploy
# or just deploy
npm run wrangler:deploy

# Generate TypeScript types
npm run wrangler:types
```

### Legacy Node.js Server
```bash
# Start both Express and Yjs WebSocket servers
node server.ts
# Express server: http://localhost:8080 (or PORT env var)
# Yjs WebSocket: ws://localhost:8136 (or YJS_PORT env var)
```

## Frontend Development
```bash
# Build for production
npm run build

# Development build with watch mode  
npm run dev

# Webpack dev server
npm run serve
```

## Quality Checks
```bash
# Check server-side TypeScript
npx tsc --noEmit

# Check client-side TypeScript
npx tsc --noEmit -p tsconfig.client.json

# Check worker TypeScript
npx tsc --noEmit -p tsconfig.worker.json
```

## Deployment
```bash
# Deploy to Heroku (legacy)
make deploy
# equivalent to: git push heroku main

# Deploy to Cloudflare (current)
npm run wrangler:deploy
```

## Useful System Commands (macOS/Darwin)
```bash
# File operations
ls -la          # List files with details
find . -name    # Find files by name
grep -r         # Search in files
cd              # Change directory

# Process management
ps aux          # List processes
lsof -i         # List open ports
kill -9 PID     # Force kill process

# Git operations
git status      # Check repository status
git add .       # Stage changes
git commit -m   # Commit with message
git push        # Push to remote
```

## Environment Variables
- `PORT`: Express server port (default: 8080)
- `YJS_PORT`: Yjs WebSocket server port (default: 8136)
- `ENVIRONMENT`: development/production