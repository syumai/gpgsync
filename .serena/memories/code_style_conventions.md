# Code Style and Conventions

## TypeScript Configuration
### Server-side (tsconfig.json)
- **Module System**: ES modules ("module": "nodenext", "target": "esnext")
- **Strict Mode**: Enabled with additional strict checks
- **File Extensions**: Uses .ts extensions with rewriteRelativeImportExtensions
- **Import Style**: Explicit .ts extensions in imports (e.g., `import { app } from "./app/server.ts"`)

### Client-side (tsconfig.client.json) 
- Separate config for webpack bundling
- React JSX support enabled

## Code Style Patterns
### Import/Export Conventions
- **ES Modules**: All files use `import`/`export` syntax
- **File Extensions**: Always include `.ts` in relative imports
- **Named Exports**: Prefer named exports over default exports
- **Example**:
  ```typescript
  import { app } from "./app/server.ts";
  import express from "express"; // External modules without extension
  ```

### Variable and Function Naming
- **camelCase**: For variables, functions, and methods
- **PascalCase**: For classes and interfaces
- **SCREAMING_SNAKE_CASE**: For constants
- **Examples**:
  ```typescript
  const expressPort = process.env.PORT || 8080;
  const homeHandler = (req: Request, res: Response): void => { };
  class YjsWebSocketServer { }
  ```

### File Naming
- **kebab-case**: For file names (e.g., `yjs-websocket-server.ts`)
- **Descriptive**: Names clearly indicate purpose

### Type Annotations
- **Explicit Types**: Function parameters and return types are explicitly typed
- **Interface Definitions**: Used for complex object structures
- **Strict Null Checks**: Enabled in TypeScript config

### Error Handling
- **Async/Await**: Preferred over promises for async operations
- **Error Middleware**: Centralized error handling in Express
- **Graceful Shutdown**: Proper cleanup for server resources

### Architecture Patterns
- **Single Responsibility**: Each file has a clear, focused purpose
- **Separation of Concerns**: Clear distinction between routes, handlers, middleware
- **Dependency Injection**: Configuration passed through function parameters