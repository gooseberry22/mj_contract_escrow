# Build Output Verification Guide

This document describes the expected build output structure and how to verify it.

## Expected Build Output Structure

After running `npm run build`, the `build/` directory should contain:

```
build/
├── index.html                    # Main HTML entry point
├── assets/
│   ├── js/
│   │   ├── index-[hash].js       # Main application bundle
│   │   ├── react-vendor-[hash].js # React vendor chunk
│   │   ├── radix-ui-[hash].js    # Radix UI components chunk
│   │   └── ui-vendor-[hash].js   # UI libraries chunk
│   └── images/
│       ├── [image-name]-[hash].png # Optimized images
│       └── ...
```

## Verification Steps

### 1. Run the Build
```bash
cd frontend
npm run build
```

### 2. Check Build Output
Verify the following:

- ✅ `build/` directory is created
- ✅ `build/index.html` exists
- ✅ `build/assets/js/` contains JavaScript bundles
- ✅ `build/assets/images/` contains image assets (if any)
- ✅ All chunks are properly hashed for cache busting
- ✅ No build errors or warnings

### 3. Verify File Sizes
Check that bundles are reasonable:
- Main bundle should be optimized
- Vendor chunks should be separated
- Total build size should be reasonable (< 5MB typically)

### 4. Test Preview (Optional)
```bash
npm run preview
```
This will serve the production build locally for testing.

## Expected Amplify Artifacts

Amplify will look for files in `build/` directory (as specified in `amplify.yml`):
- `baseDirectory: build`
- `files: '**/*'` (all files)

## Common Issues

### Issue: Build fails with module not found
**Solution:** Ensure all dependencies are installed:
```bash
npm install
```

### Issue: Assets not found in build
**Solution:** Check that assets are imported correctly in source code and path aliases are configured in `vite.config.ts`

### Issue: Build output doesn't match expected structure
**Solution:** Verify `vite.config.ts` has correct `outDir: 'build'` and asset file naming configuration

## Next Steps

After verifying the build:
1. Test locally with `npm run preview`
2. Check that all routes work
3. Verify assets load correctly
4. Proceed with Amplify deployment

