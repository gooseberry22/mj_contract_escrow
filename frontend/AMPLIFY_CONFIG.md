# AWS Amplify Configuration Guide

This document explains the Amplify configuration for the frontend application.

## Configuration Files

### `amplify.yml`
The main Amplify build configuration file located at the project root.

### `.nvmrc`
Specifies the Node.js version (20) for local development and can be used by Amplify if configured.

## Build Configuration

### App Root
- **Location**: `appRoot: frontend`
- The build process runs from the `frontend/` directory

### Build Phases

#### Pre-Build Phase
1. **Version Verification**
   - Checks Node.js version
   - Checks npm version
   - Helps debug version-related issues

2. **Dependency Installation**
   - Uses `npm ci` for clean, reproducible installs
   - Caches dependencies in `.npm/` directory
   - Uses `--prefer-offline` to speed up builds with cached packages

#### Build Phase
1. **Application Build**
   - Runs `npm run build`
   - Outputs to `build/` directory
   - Production-optimized build

### Artifacts
- **Base Directory**: `build`
- **Files**: `**/*` (all files in build directory)
- This matches the Vite output directory configuration

### Cache Configuration

The following paths are cached to speed up builds:

1. **`node_modules/**/*`**
   - Caches all installed dependencies
   - Significantly speeds up subsequent builds
   - Only reinstalls when `package.json` or `package-lock.json` changes

2. **`.npm/**/*`**
   - Caches npm's internal cache
   - Speeds up dependency resolution
   - Reduces network requests for package metadata

## Environment Variables

### Node.js Version
- **`NODE_VERSION: '20'`**
  - Specifies Node.js 20.x
  - Compatible with Vite 6.3.5
  - Set in `amplify.yml` environment variables

### Build Environment
- **`NODE_ENV: production`**
  - Ensures production optimizations
  - Required for production builds

### Application Variables
- **`VITE_API_URL`**
  - Should be set in Amplify Console
  - Or via SSM Parameter Store
  - See `AMPLIFY_ENV_SETUP.md` for details

## Node.js Version Management

### Using .nvmrc
The `.nvmrc` file specifies Node.js version 20 for:
- Local development (if using nvm)
- CI/CD systems that support .nvmrc
- Documentation purposes

### Amplify Node.js Version
**Important**: AWS Amplify determines the Node.js version based on the build image, not environment variables.

**To set Node.js version in Amplify:**
1. Go to Amplify Console → Your App → Build settings
2. Click "Edit" on the build specification
3. Or configure in Amplify Console → App settings → Build settings
4. Select Node.js version 20.x (or latest LTS)

**Alternative method (if using Amplify CLI):**
- The `NODE_VERSION` in `amplify.yml` is documented for reference
- Amplify's default build images typically include Node.js 18+ and 20+
- The current configuration works with Amplify's default Node.js 20.x image

**Note**: `.nvmrc` is included for local development and documentation. Amplify uses its build image's Node.js version unless explicitly configured in the Console.

## Build Optimization Tips

### 1. Cache Strategy
- Dependencies are cached between builds
- Only changed dependencies are reinstalled
- Build time reduces significantly after first build

### 2. Build Commands
- Using `npm ci` instead of `npm install` ensures:
  - Faster, more reliable installs
  - Exact version matching from `package-lock.json`
  - No unexpected dependency updates

### 3. Artifact Optimization
- Only necessary files are included in artifacts
- Build output is optimized by Vite
- Assets are properly hashed for cache busting

## Troubleshooting

### Build Fails with Node Version Error
- Verify `NODE_VERSION` is set to `20` in `amplify.yml`
- Check Amplify Console → Build settings → Environment variables
- Ensure Amplify supports Node.js 20 (it does as of 2024)

### Slow Build Times
- Verify cache is working (check build logs)
- Ensure `node_modules` and `.npm` are in cache paths
- Consider using Amplify's build cache settings

### Missing Environment Variables
- Check Amplify Console → Environment variables
- Verify variables are prefixed with `VITE_` for client-side access
- See `AMPLIFY_ENV_SETUP.md` for setup instructions

### Build Output Not Found
- Verify `baseDirectory: build` matches Vite's `outDir: 'build'`
- Check that build completes successfully
- Review build logs for errors

## Verification Checklist

Before deploying, verify:

- [ ] `amplify.yml` is in the project root
- [ ] `appRoot: frontend` is correct
- [ ] `baseDirectory: build` matches Vite output
- [ ] Node.js version is specified (20)
- [ ] Cache paths are configured
- [ ] Environment variables are set in Amplify Console
- [ ] Build commands are correct

## Related Files

- `amplify.yml` - Main Amplify configuration
- `.nvmrc` - Node.js version specification
- `vite.config.ts` - Vite build configuration
- `package.json` - Dependencies and scripts
- `AMPLIFY_ENV_SETUP.md` - Environment variable setup

