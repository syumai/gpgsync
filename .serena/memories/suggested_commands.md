# Suggested Commands

## Development Workflow

### Package Management
```bash
# Install dependencies (uses pnpm)
pnpm install

# Add new dependency
pnpm add <package-name>

# Add dev dependency  
pnpm add -D <package-name>

# Remove dependency
pnpm remove <package-name>
```

### Development Server
```bash
# Start the main application (both Express and Yjs servers)
node server.ts
# Runs Express server on http://localhost:8080
# Runs Yjs WebSocket server on ws://localhost:1234/ws
```

### Build Commands
```bash
# Build frontend for production
npm run build
# Equivalent to: webpack --mode production

# Build frontend for development  
npm run dev
# Equivalent to: webpack --mode development --watch

# Serve frontend with webpack dev server
npm run serve
# Equivalent to: webpack serve --mode development
```

### Deployment
```bash
# Deploy to Heroku
make deploy
# Equivalent to: git push heroku main
```

### Development Utilities
```bash
# TypeScript compilation check
npx tsc --noEmit

# Check client-side TypeScript
npx tsc --noEmit -p tsconfig.client.json

# Git operations
git status
git add .
git commit -m "commit message"
git push origin main
```

### macOS System Commands (Darwin)
```bash
# File operations
ls -la              # List files with details
find . -name "*.ts" # Find TypeScript files
grep -r "pattern"   # Search in files
tree               # Show directory structure

# Process management
ps aux | grep node  # Find Node.js processes
lsof -i :8080      # Check what's using port 8080
```

## Important Notes
- **No Testing Framework**: Currently no test commands configured (package.json test script exits with error)
- **No Linting**: No ESLint or other linting tools configured
- **No Formatting**: No Prettier or other formatting tools configured
- **Environment Variables**: 
  - `PORT` - Express server port (default: 8080)
  - `YJS_PORT` - Yjs WebSocket server port (default: 1234)