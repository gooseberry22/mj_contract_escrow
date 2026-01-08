# AWS Amplify Setup Summary

## Files Created

1. **`amplify.yml`** - Amplify build configuration file
2. **`AMPLIFY_SSM_SETUP.md`** - Complete guide for setting up SSM parameters

## Critical Issues Identified

### ✅ Fixed
- ✅ Created `amplify.yml` build configuration
- ✅ Created SSM setup documentation

### ⚠️ Still Need Action

1. **SSM Parameters Not Configured**
   - Set up `/amplify/d162pvm3rcojvl/main/VITE_API_URL` in AWS Parameter Store
   - This is the minimum required for frontend to work

2. **Backend Deployment**
   - Backend is NOT being deployed via Amplify (this is correct)
   - Backend should be deployed separately (EC2, ECS, Elastic Beanstalk, etc.)
   - Frontend needs to know backend URL via `VITE_API_URL`

3. **Build Cache Warning**
   - Cache write failed (404 error) - may need Amplify cache configuration
   - This is non-critical but will slow down builds

4. **NPM Vulnerability**
   - 1 moderate severity vulnerability detected
   - Run `npm audit` in frontend directory to identify
   - Consider running `npm audit fix` (but user said don't fix)

## Minimum Setup Required

### Step 1: Set SSM Parameter (Required)

```bash
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/VITE_API_URL" \
  --value "https://your-backend-api-url.com/api" \
  --type "String" \
  --description "Frontend API base URL"
```

**Replace `https://your-backend-api-url.com/api` with your actual backend URL**

### Step 2: Verify Amplify Permissions

Ensure Amplify service role can read SSM parameters:
- Go to AWS Console → IAM → Roles
- Find your Amplify service role
- Verify it has `ssm:GetParameter` and `ssm:GetParametersByPath` permissions

### Step 3: Trigger New Build

After setting the parameter, trigger a new build in Amplify console.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│  AWS Amplify    │         │  Backend (EC2/   │
│  (Frontend)     │────────▶│  ECS/etc)        │
│                 │  API    │                  │
│  React + Vite   │         │  Django +        │
│  Static Files   │         │  PostgreSQL      │
└─────────────────┘         └──────────────────┘
```

- **Frontend**: Deployed via AWS Amplify (static hosting)
- **Backend**: Deployed separately (not via Amplify)
- **Connection**: Frontend connects to backend via `VITE_API_URL`

## What Happens During Build

1. **PreBuild Phase**:
   - Changes to `frontend/` directory
   - Runs `npm ci` to install dependencies

2. **Build Phase**:
   - Runs `npm run build` (Vite build)
   - Outputs to `frontend/build/` directory
   - Environment variables from SSM are injected

3. **Deploy Phase**:
   - Amplify deploys `frontend/build/` contents
   - Serves as static files via CloudFront

## Environment Variables Flow

```
AWS SSM Parameter Store
    ↓
/amplify/d162pvm3rcojvl/main/VITE_API_URL
    ↓
Amplify Build Process
    ↓
Injected as VITE_API_URL during build
    ↓
Frontend code uses: import.meta.env.VITE_API_URL
```

## Testing the Setup

1. **Check Build Logs**:
   - Look for "Retrieving environment cache..."
   - Should see parameters being retrieved
   - Should NOT see "Failed to set up process.env.secrets"

2. **Verify Frontend Build**:
   - Build should complete successfully
   - Check that `frontend/build/` contains built files

3. **Test Deployed App**:
   - Visit your Amplify app URL
   - Open browser console
   - Check network requests - should point to your backend URL

## Troubleshooting

### "Failed to set up process.env.secrets"
- **Cause**: SSM parameters not found or permissions issue
- **Fix**: 
  1. Verify parameter exists: `aws ssm get-parameter --name "/amplify/d162pvm3rcojvl/main/VITE_API_URL"`
  2. Check Amplify service role permissions
  3. Verify parameter path matches exactly

### Frontend can't connect to backend
- **Cause**: `VITE_API_URL` not set or incorrect
- **Fix**: 
  1. Verify SSM parameter value is correct
  2. Check backend is accessible from internet
  3. Verify CORS is configured on backend

### Build fails
- **Cause**: Various (dependencies, syntax errors, etc.)
- **Fix**: Check build logs for specific error messages

## Next Steps

1. ✅ `amplify.yml` created
2. ⏳ Set up `VITE_API_URL` in SSM Parameter Store
3. ⏳ Deploy backend separately (if not already done)
4. ⏳ Configure backend CORS to allow Amplify domain
5. ⏳ Test end-to-end functionality

## Additional Resources

- See `AMPLIFY_SSM_SETUP.md` for detailed SSM setup instructions
- See `ENV_SETUP.md` for local development environment setup
- See `EC2_DEPLOYMENT.md` for backend deployment options


