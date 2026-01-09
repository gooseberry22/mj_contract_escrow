# Frontend AWS Amplify Deployment Checklist

This document outlines the step-by-step plan for configuring the `frontend/` directory for deployment on AWS Amplify with Vite.

## Current State Analysis

### ✅ Already Configured
- `amplify.yml` exists and points to `frontend/` directory
- Build output directory set to `build` in `vite.config.ts` (matches `amplify.yml`)
- Vite configuration with React SWC plugin
- Package.json with build scripts
- React + TypeScript application structure

### ⚠️ Missing/Needs Review
- TypeScript configuration files (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)
- ESLint configuration
- Environment variable setup
- Node version specification
- Build optimization for production
- Asset handling configuration

---

## Deployment Checklist

### Phase 1: TypeScript Configuration
- [x] **1.1** Create `tsconfig.json` in `frontend/`
  - Reference `tsconfig.app.json` and `tsconfig.node.json`
  - Similar structure to `frontend_refernce/tsconfig.json`

- [x] **1.2** Create `tsconfig.app.json` in `frontend/`
  - Configure for React application
  - Include `src` directory
  - Set appropriate compiler options (ES2020, DOM, etc.)
  - Reference: `frontend_refernce/tsconfig.app.json`

- [x] **1.3** Create `tsconfig.node.json` in `frontend/`
  - Configure for Node.js/Vite config files
  - Include `vite.config.ts`
  - Set appropriate compiler options

### Phase 2: Build Configuration
- [x] **2.1** Review and optimize `vite.config.ts`
  - Verify build output directory (`outDir: 'build'`) ✅
  - Ensure production optimizations are enabled ✅
  - Check path aliases are correctly configured ✅
  - Verify asset handling (images, fonts, etc.) ✅

- [x] **2.2** Update `package.json` scripts (if needed)
  - Ensure `build` script uses `vite build` ✅
  - Add `preview` script for local testing ✅
  - Add `type-check` script for TypeScript validation ✅
  - Verify all dependencies are listed ✅

- [x] **2.3** Verify build output structure
  - Created `BUILD_VERIFICATION.md` with verification guide ✅
  - Build output directory: `build/` (matches Amplify config) ✅
  - Asset organization configured in `vite.config.ts` ✅
  - Build tested successfully ✅
  - Verified structure:
    - `build/index.html` exists ✅
    - `build/assets/js/` contains chunks (index, react-vendor, radix-ui, ui-vendor) ✅
    - `build/assets/images/` contains image assets ✅
    - `build/assets/css/` contains CSS ✅
  - All files properly hashed for cache busting ✅

### Phase 3: Environment Variables
- [x] **3.1** Create `.env.example` file
  - Document required environment variables ✅
  - Include placeholder values ✅
  - Created with `VITE_API_URL` and optional variables ✅

- [x] **3.2** Configure Vite environment variable handling
  - Ensure `VITE_*` prefix for client-side variables ✅
  - Created `src/config/env.ts` utility for type-safe env access ✅
  - Documented which variables are needed ✅
  - Vite automatically handles `VITE_*` prefixed variables ✅

- [x] **3.3** Set up Amplify environment variables
  - Created `AMPLIFY_ENV_SETUP.md` with detailed setup guide ✅
  - Documented three methods: Console, SSM, and amplify.yml ✅
  - Documented variable names and purposes ✅
  - **Action Required:** Configure `VITE_API_URL` in AWS Amplify Console

### Phase 4: Amplify Configuration
- [x] **4.1** Review and update `amplify.yml`
  - Verify `appRoot: frontend` is correct ✅
  - Check Node.js version specification ✅
  - Verify build commands ✅
  - Confirm artifact base directory (`build`) ✅
  - Review cache configuration ✅
  - Added comments and documentation ✅

- [x] **4.2** Add Node.js version specification
  - Created `.nvmrc` file with Node.js 20 ✅
  - Added `NODE_VERSION` environment variable in `amplify.yml` ✅
  - Documented Node.js version setup in `AMPLIFY_CONFIG.md` ✅
  - **Note**: Amplify uses build image's Node.js version; configure in Console if needed ✅

- [x] **4.3** Configure build cache
  - Verified `node_modules` caching ✅
  - Added `.npm` cache configuration ✅
  - Added optional `build/**/*` cache for incremental builds ✅
  - Optimized cache paths with comments ✅

### Phase 5: Code Quality & Linting
- [x] **5.1** Create ESLint configuration
  - Created `eslint.config.js` ✅
  - Based on `frontend_refernce/eslint.config.js` ✅
  - Configured for React + TypeScript ✅
  - Set up appropriate rules (React hooks, TypeScript, unused vars) ✅
  - Added ignores for `dist`, `build`, `node_modules` ✅

- [x] **5.2** Add lint script to `package.json`
  - Added `lint` script ✅
  - Added `lint:fix` script for auto-fixing ✅
  - Added ESLint dependencies to `devDependencies` ✅

- [x] **5.3** (Optional) Add Prettier configuration
  - Created `.prettierrc` with sensible defaults ✅
  - Created `.prettierignore` file ✅
  - Added `format` and `format:check` scripts ✅
  - Added Prettier to `devDependencies` ✅

### Phase 6: Asset & Static File Handling
- [x] **6.1** Verify asset imports
  - Checked image imports in components ✅
  - Assets are in correct location (`src/assets/`) ✅
  - Verified path aliases work correctly (`figma:asset/*` and `@`) ✅
  - All components using assets verified ✅

- [x] **6.2** Configure public assets (if any)
  - No `public/` directory needed (all assets in `src/assets/`) ✅
  - Static assets are processed by Vite ✅
  - Created `ASSET_MANAGEMENT.md` documentation ✅

- [x] **6.3** Test asset loading in production build
  - Build tested successfully ✅
  - Assets present in `build/assets/images/` with hashes ✅
  - No broken image paths ✅
  - No fonts currently used (none needed) ✅
  - Asset file naming verified (hashed for cache busting) ✅

### Phase 7: Routing & SPA Configuration
- [x] **7.1** Configure Amplify for SPA routing
  - Added redirect rules in `amplify.yml` ✅
  - Configured rewrites to serve `index.html` for all routes ✅
  - Configured 404 redirects to `index.html` ✅
  - Added security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection) ✅
  - Created `SPA_ROUTING.md` documentation ✅

- [x] **7.2** Verify routing works in production
  - Documented routing verification steps ✅
  - App uses state-based navigation (not URL-based) ✅
  - Redirect rules configured for future URL-based routing ✅
  - **Action Required:** Test routing after deployment to Amplify:
    - Test direct URL access
    - Test page refresh
    - Test 404 handling

### Phase 8: Testing & Validation
- [ ] **8.1** Local build test
  - Run `npm install`
  - Run `npm run build`
  - Verify no build errors
  - Check build output size

- [ ] **8.2** Local preview test
  - Run `npm run preview` (if added)
  - Test application functionality
  - Verify all pages load correctly

- [ ] **8.3** Type checking
  - Run TypeScript compiler check
  - Fix any type errors
  - Ensure strict mode compliance

### Phase 9: Documentation
- [ ] **9.1** Update `frontend/README.md`
  - Document build process
  - Document environment variables
  - Add deployment instructions
  - Include troubleshooting section

- [ ] **9.2** Document Amplify-specific configurations
  - Note any Amplify Console settings
  - Document custom headers if needed
  - Document domain configuration

### Phase 10: Deployment
- [ ] **10.1** Initial Amplify deployment
  - Connect repository to Amplify
  - Configure build settings
  - Set environment variables
  - Trigger first build

- [ ] **10.2** Verify deployment
  - Check build logs for errors
  - Test deployed application
  - Verify all routes work
  - Check console for errors

- [ ] **10.3** Performance optimization
  - Check bundle size
  - Verify code splitting (if applicable)
  - Check asset optimization
  - Review Lighthouse scores

---

## Detailed Implementation Notes

### TypeScript Configuration
The reference folder uses a modular TypeScript setup with:
- `tsconfig.json` - Main config with references
- `tsconfig.app.json` - Application-specific config
- `tsconfig.node.json` - Node/Vite config-specific

**Action Required:** Create these files based on `frontend_refernce/` structure, adapted for current frontend setup.

### Vite Configuration Differences
**Current frontend:**
- Uses `@vitejs/plugin-react-swc` (faster)
- Complex path aliases
- Custom build output: `build`
- Server config with port 3000

**Reference frontend:**
- Uses `@vitejs/plugin-react` (standard)
- Simpler config
- Default build output

**Decision Needed:** Keep SWC plugin or switch to standard plugin?

### Environment Variables
Current `amplify.yml` mentions:
- `VITE_API_URL` (from SSM Parameter Store)
- `NODE_ENV: production`

**Action Required:** 
- Document all required environment variables
- Create `.env.example`
- Configure in Amplify Console

### Build Output
- Current: `outDir: 'build'` ✅
- Amplify expects: `baseDirectory: build` ✅
- **Status:** Already aligned!

### Node Version
**Action Required:** Specify Node.js version:
- Option 1: Add to `amplify.yml` environment
- Option 2: Create `.nvmrc` file
- Recommended: Node 18.x or 20.x for Vite 6.3.5

---

## Priority Order

1. **High Priority** (Required for deployment):
   - Phase 1: TypeScript Configuration
   - Phase 2: Build Configuration
   - Phase 4: Amplify Configuration
   - Phase 8: Testing & Validation

2. **Medium Priority** (Recommended):
   - Phase 3: Environment Variables
   - Phase 5: Code Quality & Linting
   - Phase 6: Asset & Static File Handling

3. **Low Priority** (Nice to have):
   - Phase 7: Routing & SPA Configuration (if using client-side routing)
   - Phase 9: Documentation
   - Phase 10: Deployment (final step)

---

## Questions to Resolve

1. **TypeScript Config:** Should we use the same structure as `frontend_refernce/`?
2. **ESLint:** Should we add ESLint configuration now or later?
3. **Environment Variables:** What environment variables does the app actually need?
4. **Node Version:** Which Node.js version should we target?
5. **Vite Plugin:** Keep `react-swc` or switch to standard `react` plugin?
6. **Routing:** Does the app need SPA redirect rules in Amplify?

---

## Next Steps

1. Review this checklist
2. Prioritize which phases to implement
3. Start with Phase 1 (TypeScript Configuration)
4. Test each phase before moving to the next
5. Document any issues or deviations

---

## Reference Files

- `frontend_refernce/vite.config.ts` - Simpler Vite config
- `frontend_refernce/package.json` - Reference dependencies
- `frontend_refernce/tsconfig.json` - TypeScript config structure
- `frontend_refernce/eslint.config.js` - ESLint configuration
- `amplify.yml` - Current Amplify build configuration

---

**Last Updated:** [Date will be updated as we progress]
**Status:** Planning Phase - Awaiting implementation decisions

