# Asset Management Guide

This document describes how assets (images, fonts, etc.) are managed in the frontend application.

## Asset Organization

### Source Assets
- **Location**: `src/assets/`
- **Current Assets**:
  - `01aad80c9e4e40f463b2a2f826ac957846249920.png` - Logo image
  - `772aa6854dfe11f4288b7a955fea018059bbad2d.png` - Logo variant

### Build Output
- **Location**: `build/assets/images/`
- Assets are automatically:
  - Processed and optimized by Vite
  - Hashed for cache busting
  - Organized by type (images, fonts, etc.)

## Asset Import Methods

### Method 1: Using Figma Asset Aliases (Current)

Assets exported from Figma use custom path aliases:

```typescript
import logoImage from 'figma:asset/01aad80c9e4e40f463b2a2f826ac957846249920.png';
```

**Configuration**: Defined in `vite.config.ts`:
```typescript
alias: {
  'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png': path.resolve(__dirname, './src/assets/772aa6854dfe11f4288b7a955fea018059bbad2d.png'),
  'figma:asset/01aad80c9e4e40f463b2a2f826ac957846249920.png': path.resolve(__dirname, './src/assets/01aad80c9e4e40f463b2a2f826ac957846249920.png'),
}
```

### Method 2: Direct Import (Alternative)

You can also import assets directly:

```typescript
import logoImage from '@/assets/01aad80c9e4e40f463b2a2f826ac957846249920.png';
```

**Note**: The `@` alias points to `src/` directory.

### Method 3: Public Assets (Not Currently Used)

For static assets that don't need processing, you can use a `public/` directory:

1. Create `public/` directory in `frontend/`
2. Place assets in `public/`
3. Reference them with absolute paths: `/asset-name.png`

**Current Status**: No `public/` directory exists (not needed).

## Asset Types

### Images
- **Supported Formats**: PNG, JPG, JPEG, SVG, GIF, WebP
- **Location**: `src/assets/`
- **Build Output**: `build/assets/images/[name]-[hash].[ext]`
- **Configuration**: Defined in `vite.config.ts` → `assetsInclude`

### Fonts (If Needed)
- **Supported Formats**: WOFF, WOFF2, TTF, OTF, EOT
- **Location**: `src/assets/fonts/` (create if needed)
- **Build Output**: `build/assets/fonts/[name]-[hash].[ext]`
- **Current Status**: No fonts currently used

## Build Configuration

### Asset Handling
Configured in `vite.config.ts`:

```typescript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        // Images → assets/images/
        // Fonts → assets/fonts/
        // Other → assets/[ext]/
      }
    }
  },
  assetsInlineLimit: 4096, // Inline assets < 4KB as base64
}
```

### Asset Optimization
- **Small assets** (< 4KB): Inlined as base64 in JavaScript
- **Large assets**: Copied to build directory with content hash
- **Cache busting**: All assets include content hash in filename

## Verification

### Check Asset Imports
All components using assets:
- `Logo.tsx` - Uses logo image
- `ContractParsing.tsx` - Uses logo
- `Milestones.tsx` - Uses logo
- `Payments.tsx` - Uses logo
- `Support.tsx` - Uses logo
- `SurrogateDashboard.tsx` - Uses logo
- `SurrogateLostWages.tsx` - Uses logo
- `SurrogatePayments.tsx` - Uses logo
- `SurrogateConfirmation.tsx` - Uses logo
- `ContractTemplate.tsx` - Uses logo

### Build Verification
After building, verify:
1. ✅ Assets exist in `build/assets/images/`
2. ✅ Assets have content hashes in filenames
3. ✅ Assets are referenced correctly in `build/index.html`
4. ✅ No broken image paths

## Adding New Assets

### Step 1: Add Asset File
Place the asset in `src/assets/`:
```bash
cp new-image.png frontend/src/assets/
```

### Step 2: Update Vite Config (if using Figma alias)
If using `figma:asset/` alias, add to `vite.config.ts`:
```typescript
alias: {
  'figma:asset/new-image.png': path.resolve(__dirname, './src/assets/new-image.png'),
}
```

### Step 3: Import in Component
```typescript
import newImage from 'figma:asset/new-image.png';
// or
import newImage from '@/assets/new-image.png';
```

### Step 4: Use in Component
```typescript
<img src={newImage} alt="Description" />
```

## Troubleshooting

### Asset Not Found
- Verify file exists in `src/assets/`
- Check import path matches file location
- Ensure path alias is configured (if using custom alias)
- Rebuild after adding new assets

### Asset Not Loading in Production
- Check build output directory structure
- Verify asset paths in `build/index.html`
- Check browser console for 404 errors
- Ensure assets are included in build (check `build/assets/`)

### Broken Image Paths
- Verify Vite asset handling configuration
- Check that assets are imported (not using string paths)
- Ensure build output includes assets
- Check for typos in import paths

## Best Practices

1. **Use imports, not string paths**
   ```typescript
   // ✅ Good
   import logo from '@/assets/logo.png';
   <img src={logo} />
   
   // ❌ Bad
   <img src="/assets/logo.png" />
   ```

2. **Organize assets by type**
   - Images: `src/assets/images/`
   - Fonts: `src/assets/fonts/`
   - Icons: `src/assets/icons/`

3. **Optimize assets before adding**
   - Compress images
   - Use appropriate formats (WebP for photos, SVG for icons)
   - Remove unnecessary metadata

4. **Use descriptive filenames**
   - `logo.png` instead of `img1.png`
   - Include size/variant if needed: `logo-large.png`

## Related Files

- `vite.config.ts` - Asset handling configuration
- `src/assets/` - Source assets directory
- `build/assets/` - Build output assets
- `src/components/Logo.tsx` - Example asset usage


