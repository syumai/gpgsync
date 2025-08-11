# Code Style and Conventions

## Module System
- **ES Modules**: All files use `import`/`export` syntax
- **File Extensions**: Use `.ts` extensions in relative imports
- **Module Detection**: Forced in TypeScript config
- **Verbatim Modules**: Disabled for flexibility

## Naming Conventions
- **Variables/Functions**: camelCase
- **Classes**: PascalCase  
- **Files**: kebab-case
- **Constants**: camelCase (following modern TypeScript patterns)

## TypeScript Configuration
- **Strict Mode**: Enabled across all configurations
- **Target**: ESNext for modern features
- **Module**: NodeNext for Node.js compatibility
- **Null Checks**: Strict null checks enabled
- **Index Access**: No unchecked indexed access
- **Optional Properties**: Exact optional property types
- **Source Maps**: Generated for debugging
- **Declaration Maps**: Generated for type information

## Error Handling
- **Async/Await**: Preferred over Promise chains
- **Centralized Middleware**: Express error handling in middlewares.ts
- **Graceful Shutdown**: Implemented for server lifecycle

## Code Organization
- **Single Responsibility**: Each module has clear purpose
- **Separation of Concerns**: Clear boundaries between layers
- **Validation**: Centralized in validators.ts
- **Error Types**: Defined in errors.ts

## Import Style
- Explicit .ts extensions in relative imports
- ES module syntax throughout
- Type imports when needed

## Architecture Patterns
- Functional programming style preferred
- Immutable data structures where possible
- Clear separation between business logic and framework code
- Configuration-driven approach for different environments