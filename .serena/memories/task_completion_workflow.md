# Task Completion Workflow

## Pre-Development Setup
1. **Install Dependencies**: Run `pnpm install` if package.json has changed
2. **Check TypeScript**: Run `npx tsc --noEmit` to verify server-side types
3. **Check Client TypeScript**: Run `npx tsc --noEmit -p tsconfig.client.json` for client types

## Development Process
1. **Start Development Server**: Run `node server.ts` to start both servers
2. **Frontend Development**: Use `npm run dev` for automatic webpack rebuilds
3. **Test in Browser**: Access `http://localhost:8080` to test changes

## Code Quality Checks
⚠️ **Important**: This project currently has NO automated testing, linting, or formatting tools configured.

### Manual Quality Checks
1. **TypeScript Compilation**: 
   - Server: `npx tsc --noEmit`
   - Client: `npx tsc --noEmit -p tsconfig.client.json`
2. **Build Verification**: `npm run build` should complete without errors
3. **Manual Testing**: Test application functionality in browser
4. **Code Review**: Manually review code for:
   - TypeScript type safety
   - ES module import/export consistency
   - Error handling
   - Proper async/await usage

## Pre-Commit Checklist
- [ ] TypeScript compiles without errors (both server and client)
- [ ] Webpack build succeeds (`npm run build`)
- [ ] Application starts without errors (`node server.ts`)
- [ ] Manual testing of affected functionality
- [ ] Code follows project conventions (ES modules, .ts extensions)

## Deployment Workflow
1. **Build Production Assets**: `npm run build`
2. **Commit Changes**: Standard git workflow
3. **Deploy**: `make deploy` (pushes to Heroku)

## Recommendations for Improvement
The following tools should be considered for future implementation:
- **Testing**: Jest, Vitest, or similar testing framework
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with TypeScript support  
- **Pre-commit Hooks**: husky + lint-staged
- **CI/CD**: GitHub Actions for automated testing and deployment

## Error Handling
- Server errors are logged to console
- Both servers have graceful shutdown handlers (SIGTERM, SIGINT)
- Uncaught exceptions and unhandled rejections trigger server shutdown
- Express has centralized error handling middleware