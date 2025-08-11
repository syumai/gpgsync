# Suggested Commands for gpgsync Development

## Essential Development Commands

### Package Management
```bash
# Install dependencies (uses pnpm)
pnpm install

# Note: The project uses pnpm as indicated by pnpm-lock.yaml
```

### Running the Application
```bash
# Start the server (development)
node server.js
# Server runs on http://localhost:8080 by default
# Uses PORT environment variable if set

# Alternative using npm (if npm scripts are added)
npm start
```

### Deployment
```bash
# Deploy to Heroku (using Makefile)
make deploy
# This runs: git push heroku main
```

### System Commands (macOS/Darwin)
```bash
# File operations
ls -la                 # List files with details
find . -name "*.js"    # Find JavaScript files
grep -r "pattern" .    # Search for patterns in files

# Git operations
git status            # Check repository status
git add .             # Stage changes
git commit -m "msg"   # Commit changes
git push origin main  # Push to main branch
git push heroku main  # Deploy to Heroku
```

### Development Workflow
```bash
# 1. Make changes to code
# 2. Test locally with: node server.js
# 3. Check git status: git status
# 4. Stage changes: git add .
# 5. Commit: git commit -m "description"
# 6. Deploy: make deploy
```

## Port Configuration
- Default: 8080
- Environment variable: PORT
- Production (Heroku): Uses dynamic port assignment

## No Testing/Linting Commands
**Note**: The project currently has minimal npm scripts. The package.json only contains a placeholder test script that exits with an error. No linting, formatting, or testing commands are configured yet.