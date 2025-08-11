# Suggested Commands

## Development Commands

### Running the Application
```bash
# Install dependencies (uses pnpm)
pnpm install

# Start the development server (Cloudflare Workers with Wrangler)
npm run cf:dev
# or
make dev
# Application runs on http://localhost:8787 by default
```

### Frontend Development
```bash
# Build frontend for production
npm run build

# Build frontend for development with watch mode
npm run dev

# Serve frontend with webpack dev server
npm run serve
```

### Deployment
```bash
# Deploy to Cloudflare Workers
make deploy
# This runs: npm run cf:deploy (which runs npm run build && wrangler deploy)

# Development deployment with Wrangler
npm run wrangler:dev

# Production deployment with Wrangler
npm run wrangler:deploy
```

### Quality Checks
```bash
# Check worker TypeScript compilation
npx tsc --noEmit -p tsconfig.worker.json

# Check client-side TypeScript compilation  
npx tsc --noEmit -p tsconfig.client.json

# Generate Wrangler types (for Cloudflare Workers)
npm run wrangler:types
```

### Available npm scripts
- `npm run build` - Build frontend for production
- `npm run dev` - Build frontend in development mode with watch
- `npm run serve` - Serve frontend with webpack dev server
- `npm run wrangler:dev` - Start Wrangler development server
- `npm run wrangler:deploy` - Deploy to Cloudflare Workers
- `npm run wrangler:types` - Generate Cloudflare Workers types
- `npm run cf:dev` - Build and run with Wrangler
- `npm run cf:deploy` - Build and deploy to Cloudflare Workers

### Testing
**Note**: The project currently has no automated testing, linting, or formatting tools configured. The package.json test script is a placeholder that exits with an error.