# Linting and Code Quality Setup

This document describes the ESLint and Prettier configuration for the frontend application.

## ESLint Configuration

### Configuration File
- **Location**: `eslint.config.js`
- **Type**: Flat config (ESLint 9.x format)

### Features
- ✅ React Hooks linting
- ✅ React Refresh rules
- ✅ TypeScript support
- ✅ Recommended JavaScript rules
- ✅ TypeScript-specific rules

### Rules Configuration

#### React Rules
- `react-hooks/rules-of-hooks`: Enforces React Hooks rules
- `react-hooks/exhaustive-deps`: Warns about missing dependencies
- `react-refresh/only-export-components`: Warns about non-component exports

#### TypeScript Rules
- `@typescript-eslint/no-unused-vars`: Warns about unused variables (allows `_` prefix)
- `@typescript-eslint/no-explicit-any`: Warns about `any` types (useful during development)

### Ignored Directories
- `dist/` - Build output
- `build/` - Production build
- `node_modules/` - Dependencies

## Prettier Configuration

### Configuration File
- **Location**: `.prettierrc`
- **Ignore File**: `.prettierignore`

### Formatting Rules
- **Semicolons**: Enabled
- **Quotes**: Single quotes
- **Trailing Commas**: ES5 style
- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Arrow Parens**: Avoid parentheses when possible
- **End of Line**: LF (Unix style)

## Usage

### Linting

#### Check for linting errors:
```bash
npm run lint
```

#### Auto-fix linting errors:
```bash
npm run lint:fix
```

### Formatting

#### Format all files:
```bash
npm run format
```

#### Check formatting (CI/CD):
```bash
npm run format:check
```

## Integration with Development Workflow

### Pre-commit (Recommended)
Consider adding a pre-commit hook to run linting and formatting:

```bash
# Install husky (optional)
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint:fix && npm run format"
```

### VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Dependencies

### ESLint Packages
- `@eslint/js` - ESLint recommended rules
- `eslint` - Core ESLint
- `eslint-plugin-react-hooks` - React Hooks linting
- `eslint-plugin-react-refresh` - React Refresh rules
- `typescript-eslint` - TypeScript ESLint integration
- `globals` - Global variables definitions

### Prettier
- `prettier` - Code formatter

## Troubleshooting

### ESLint not finding config
- Ensure `eslint.config.js` is in the project root
- Verify ESLint version is 9.x or higher
- Check that all dependencies are installed

### Prettier conflicts with ESLint
- Prettier handles formatting
- ESLint handles code quality
- They work together without conflicts

### TypeScript errors in ESLint
- Ensure `typescript-eslint` is installed
- Check that TypeScript config files exist
- Verify file extensions are `.ts` or `.tsx`

## Best Practices

1. **Run linting before commits**
   - Catch errors early
   - Maintain code quality

2. **Use auto-fix when possible**
   - `npm run lint:fix` fixes many issues automatically
   - Review changes before committing

3. **Format code regularly**
   - Consistent formatting improves readability
   - Use `npm run format` before committing

4. **Configure your IDE**
   - Enable format on save
   - Enable ESLint auto-fix on save
   - Improves development experience

## Related Files

- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Prettier ignore patterns
- `package.json` - Scripts and dependencies


