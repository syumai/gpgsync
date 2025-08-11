# Task Completion Workflow

## Quality Checks Before Completion

### TypeScript Compilation
Always run TypeScript checks for the relevant parts of the codebase:
```bash
# Server-side code
npx tsc --noEmit

# Client-side code  
npx tsc --noEmit -p tsconfig.client.json

# Cloudflare Worker code
npx tsc --noEmit -p tsconfig.worker.json
```

### Build Verification
```bash
# Frontend build
npm run build

# Development build (with watch)
npm run dev
```

### Testing
**Note**: The project currently has no automated testing framework configured. The test script is a placeholder that exits with an error.

### Manual Testing
- Start the development server and verify functionality
- Test collaborative editing features in multiple browser sessions
- Verify Go code execution works properly
- Check room creation and navigation

## Deployment Verification

### Cloudflare Workers (Current)
```bash
# Test locally first
npm run wrangler:dev

# Deploy when ready
npm run wrangler:deploy
```

### Legacy Heroku
```bash
# Deploy via git
make deploy
```

## No Linting/Formatting Tools
The project currently does not have:
- ESLint configuration
- Prettier setup  
- Automated formatting
- Pre-commit hooks

Code style should be maintained manually following the conventions in code_style_conventions.md.

## Git Workflow
Standard git practices:
1. Create feature branch if needed
2. Make changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push changes
6. Deploy if authorized

## Environment Testing
Test in both development and production-like environments:
- Local development server
- Wrangler dev environment  
- Deployed Cloudflare Workers
- Legacy Heroku deployment (if still active)