# Code Style and Conventions for gpgsync

## JavaScript/Node.js Conventions

### Code Style Observations
Based on the existing codebase analysis:

#### File Naming
- Use kebab-case for file names: `editor-socketio-server.js`
- Directory names are lowercase: `app`, `lib`, `views`, `public`
- Templates use `.ejs` extension for EJS templates

#### JavaScript Style
- **Modules**: Uses CommonJS (`require`/`module.exports`) pattern
- **Semicolons**: Consistently used at end of statements
- **Quotes**: Uses double quotes for strings
- **Indentation**: Appears to use 2 spaces (standard Node.js convention)
- **Variable declarations**: Uses `const` for constants, appropriate scoping

#### Module Structure
```javascript
// Import dependencies at the top
const express = require("express");
const { someFunction } = require("./module");

// Main logic
const someVariable = value;

// Export at the bottom
module.exports = { exportedItem };
```

#### Express.js Patterns
- Handlers are separated into dedicated files (`app/handlers.js`)
- Middleware functions in separate file (`app/middlewares.js`)
- Validation logic separated (`app/validators.js`)
- Constants defined in separate file (`app/consts.js`)

### File Organization
- **app/**: Core application logic and Express setup
- **lib/**: Reusable library modules
- **views/**: EJS templates
- **public/**: Static assets (CSS, JS, images)
- **Root level**: Entry point and configuration files

### Dependencies Management
- Uses **pnpm** as package manager (evidenced by pnpm-lock.yaml)
- Dependencies are clearly separated from devDependencies in package.json
- Specific version pinning for critical dependencies

### Error Handling
- Dedicated error handling module (`app/errors.js`)
- Express error handling middleware

## No Established Guidelines Yet
**Note**: The project doesn't have:
- ESLint configuration
- Prettier configuration  
- Formal coding standards document
- TypeScript (uses plain JavaScript)
- Automated code formatting
- Documentation generation tools

## Recommendations for Future Development
- Consider adding ESLint for code consistency
- Add Prettier for automatic formatting
- Implement unit testing framework
- Add JSDoc comments for better documentation