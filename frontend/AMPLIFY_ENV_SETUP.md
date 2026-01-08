# AWS Amplify Environment Variables Setup

This guide explains how to configure environment variables for the frontend application in AWS Amplify.

## Overview

Vite only exposes environment variables that are prefixed with `VITE_` to the client-side code. This is a security feature to prevent accidentally exposing sensitive server-side variables.

## Required Environment Variables

### `VITE_API_URL`
- **Description**: The base URL for the backend API
- **Development**: `http://localhost:8000/api`
- **Production**: Your production API URL (e.g., `https://api.yourdomain.com/api`)
- **Required**: Yes (for API calls)

## Setting Up Environment Variables in AWS Amplify

### Method 1: Amplify Console (Recommended)

1. **Navigate to your Amplify App**
   - Go to AWS Amplify Console
   - Select your application
   - Click on "Environment variables" in the left sidebar

2. **Add Environment Variables**
   - Click "Manage variables"
   - Add each variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Your production API URL
     - **Environment**: Select which environments (e.g., Production, Preview)

3. **Save Changes**
   - Click "Save"
   - The variables will be available during the build process

### Method 2: Using SSM Parameter Store (Advanced)

As mentioned in `amplify.yml`, you can also use AWS Systems Manager Parameter Store:

1. **Store the value in SSM Parameter Store**
   ```bash
   aws ssm put-parameter \
     --name "/amplify/your-app-id/VITE_API_URL" \
     --value "https://api.yourdomain.com/api" \
     --type "String"
   ```

2. **Update amplify.yml to retrieve from SSM**
   ```yaml
   preBuild:
     commands:
       - |
         VITE_API_URL=$(aws ssm get-parameter --name "/amplify/your-app-id/VITE_API_URL" --query "Parameter.Value" --output text)
         export VITE_API_URL
   ```

### Method 3: Using amplify.yml (Simple)

You can also set environment variables directly in `amplify.yml`:

```yaml
environment:
  variables:
    NODE_ENV: production
    VITE_API_URL: https://api.yourdomain.com/api
```

**Note**: This method exposes the value in your repository, so only use for non-sensitive values.

## Environment Variable Access in Code

Use the provided environment configuration utility:

```typescript
import { env, getApiUrl } from '@/config/env';

// Get API URL
const apiUrl = getApiUrl();
// or
const apiUrl = env.VITE_API_URL;

// Check environment
if (env.DEV) {
  console.log('Development mode');
}

if (env.PROD) {
  console.log('Production mode');
}
```

## Verification

After setting up environment variables:

1. **Trigger a new build** in Amplify
2. **Check build logs** to verify variables are available
3. **Inspect the built application** to ensure API calls use the correct URL

## Troubleshooting

### Variables not available in build
- Ensure variables are prefixed with `VITE_`
- Check that variables are set for the correct environment (Production/Preview)
- Verify the build is using the correct branch/environment

### Variables not accessible in code
- Only `VITE_*` prefixed variables are exposed to client-side code
- Use `import.meta.env.VITE_*` to access variables
- Variables are replaced at build time, not runtime

### API calls failing
- Verify `VITE_API_URL` is set correctly
- Check CORS settings on your backend
- Ensure the API URL includes the protocol (http:// or https://)

## Security Best Practices

1. **Never expose sensitive data** like:
   - API keys
   - Secret keys
   - Database credentials
   - Private tokens

2. **Use server-side environment variables** for sensitive data
3. **Only use `VITE_*` prefix** for public configuration
4. **Review built files** to ensure no secrets are exposed

## Example Configuration

### Development (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
```

### Production (Amplify Console)
```
VITE_API_URL=https://api.yourdomain.com/api
```

## Related Files

- `.env.example` - Example environment variables
- `src/config/env.ts` - Environment configuration utility
- `amplify.yml` - Amplify build configuration
- `vite.config.ts` - Vite configuration

