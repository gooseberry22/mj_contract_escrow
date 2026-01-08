# AWS Amplify SSM Parameter Store Setup Guide

This guide explains how to configure AWS Systems Manager (SSM) Parameter Store parameters for your Amplify deployment.

## Overview

AWS Amplify automatically retrieves environment variables from SSM Parameter Store using the path pattern:
```
/amplify/{APP_ID}/{BRANCH_NAME}/
```

For your app, the path is:
```
/amplify/d162pvm3rcojvl/main/
```

## Required Parameters

### Frontend Environment Variables

#### 1. VITE_API_URL
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/VITE_API_URL`
- **Type**: `String`
- **Value**: Your production backend API URL
- **Example**: `https://api.yourdomain.com/api` or `https://your-backend.elasticbeanstalk.com/api`
- **Description**: Base URL for the frontend to connect to the Django backend API
- **Required**: Yes

### Backend Environment Variables (if deploying backend separately)

If you're deploying the Django backend separately (recommended), you'll need these parameters in your backend deployment environment:

#### 2. SECRET_KEY
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/SECRET_KEY` (or in your backend deployment)
- **Type**: `SecureString`
- **Value**: Strong Django secret key
- **How to Generate**:
  ```bash
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```
- **Description**: Django secret key for cryptographic signing
- **Required**: Yes (for backend)

#### 3. DEBUG
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/DEBUG` (or in your backend deployment)
- **Type**: `String`
- **Value**: `False`
- **Description**: Django debug mode (must be False in production)
- **Required**: Yes (for backend)

#### 4. ALLOWED_HOSTS
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/ALLOWED_HOSTS` (or in your backend deployment)
- **Type**: `String`
- **Value**: Comma-separated list of allowed hostnames
- **Example**: `yourdomain.com,www.yourdomain.com,api.yourdomain.com`
- **Description**: Django ALLOWED_HOSTS setting
- **Required**: Yes (for backend)

#### 5. DB_NAME
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/DB_NAME` (or in your backend deployment)
- **Type**: `String`
- **Value**: PostgreSQL database name
- **Example**: `surrogate_escrow`
- **Description**: PostgreSQL database name
- **Required**: Yes (for backend)

#### 6. DB_USER
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/DB_USER` (or in your backend deployment)
- **Type**: `String`
- **Value**: PostgreSQL database user
- **Example**: `postgres`
- **Description**: PostgreSQL database username
- **Required**: Yes (for backend)

#### 7. DB_PASSWORD
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/DB_PASSWORD` (or in your backend deployment)
- **Type**: `SecureString`
- **Value**: Strong PostgreSQL password
- **Description**: PostgreSQL database password
- **Required**: Yes (for backend)

#### 8. DB_HOST
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/DB_HOST` (or in your backend deployment)
- **Type**: `String`
- **Value**: PostgreSQL database host
- **Example**: `your-rds-instance.region.rds.amazonaws.com` or `localhost`
- **Description**: PostgreSQL database hostname
- **Required**: Yes (for backend)

#### 9. DB_PORT
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/DB_PORT` (or in your backend deployment)
- **Type**: `String`
- **Value**: PostgreSQL port
- **Example**: `5432`
- **Description**: PostgreSQL database port
- **Required**: Yes (for backend)

#### 10. CORS_ALLOWED_ORIGINS
- **Parameter Name**: `/amplify/d162pvm3rcojvl/main/CORS_ALLOWED_ORIGINS` (or in your backend deployment)
- **Type**: `String`
- **Value**: Comma-separated list of allowed CORS origins
- **Example**: `https://yourdomain.com,https://www.yourdomain.com,https://main.d162pvm3rcojvl.amplifyapp.com`
- **Description**: CORS allowed origins for Django backend
- **Required**: Yes (for backend)

## How to Set Up Parameters in AWS Console

### Method 1: AWS Console (Web UI)

1. **Navigate to Systems Manager Parameter Store**:
   - Go to AWS Console → Systems Manager → Parameter Store
   - Or visit: https://console.aws.amazon.com/systems-manager/parameters

2. **Create Parameter**:
   - Click "Create parameter"
   - **Name**: Enter the full parameter path (e.g., `/amplify/d162pvm3rcojvl/main/VITE_API_URL`)
   - **Description**: Enter a description (optional but recommended)
   - **Tier**: Choose "Standard" (free) or "Advanced" (if you need more than 10,000 parameters)
   - **Type**: 
     - Choose `String` for regular values
     - Choose `SecureString` for sensitive values (SECRET_KEY, DB_PASSWORD)
   - **Value**: Enter the parameter value
   - Click "Create parameter"

3. **Repeat** for all required parameters

### Method 2: AWS CLI

```bash
# Set VITE_API_URL (frontend)
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/VITE_API_URL" \
  --value "https://api.yourdomain.com/api" \
  --type "String" \
  --description "Frontend API base URL"

# Set SECRET_KEY (backend - use SecureString)
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/SECRET_KEY" \
  --value "your-generated-secret-key-here" \
  --type "SecureString" \
  --description "Django secret key"

# Set DEBUG (backend)
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/DEBUG" \
  --value "False" \
  --type "String" \
  --description "Django debug mode"

# Set ALLOWED_HOSTS (backend)
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/ALLOWED_HOSTS" \
  --value "yourdomain.com,www.yourdomain.com,api.yourdomain.com" \
  --type "String" \
  --description "Django allowed hosts"

# Set Database parameters (backend)
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/DB_NAME" \
  --value "surrogate_escrow" \
  --type "String" \
  --description "PostgreSQL database name"

aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/DB_USER" \
  --value "postgres" \
  --type "String" \
  --description "PostgreSQL database user"

aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/DB_PASSWORD" \
  --value "your-strong-password" \
  --type "SecureString" \
  --description "PostgreSQL database password"

aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/DB_HOST" \
  --value "your-rds-instance.region.rds.amazonaws.com" \
  --type "String" \
  --description "PostgreSQL database host"

aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/DB_PORT" \
  --value "5432" \
  --type "String" \
  --description "PostgreSQL database port"

# Set CORS_ALLOWED_ORIGINS (backend)
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/CORS_ALLOWED_ORIGINS" \
  --value "https://yourdomain.com,https://www.yourdomain.com,https://main.d162pvm3rcojvl.amplifyapp.com" \
  --type "String" \
  --description "CORS allowed origins"
```

### Method 3: Update Existing Parameters

If a parameter already exists, use `--overwrite` flag:

```bash
aws ssm put-parameter \
  --name "/amplify/d162pvm3rcojvl/main/VITE_API_URL" \
  --value "https://new-api-url.com/api" \
  --type "String" \
  --overwrite
```

## IAM Permissions Required

Your Amplify service role needs the following permissions to read SSM parameters:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": [
        "arn:aws:ssm:*:*:parameter/amplify/d162pvm3rcojvl/main/*"
      ]
    }
  ]
}
```

If using SecureString parameters, also add:
```json
{
  "Effect": "Allow",
  "Action": [
    "kms:Decrypt"
  ],
  "Resource": [
    "arn:aws:kms:*:*:key/*"
  ],
  "Condition": {
    "StringEquals": {
      "kms:ViaService": "ssm.*.amazonaws.com"
    }
  }
}
```

## Verify Parameters Are Set

### Using AWS Console:
1. Go to Parameter Store
2. Filter by path: `/amplify/d162pvm3rcojvl/main/`
3. Verify all parameters are listed

### Using AWS CLI:
```bash
# List all parameters for your Amplify app
aws ssm get-parameters-by-path \
  --path "/amplify/d162pvm3rcojvl/main/" \
  --recursive \
  --query "Parameters[*].[Name,Type]" \
  --output table

# Get a specific parameter value
aws ssm get-parameter \
  --name "/amplify/d162pvm3rcojvl/main/VITE_API_URL" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text
```

## Troubleshooting

### Issue: "Failed to set up process.env.secrets"
**Solution**: 
- Verify parameters exist in SSM Parameter Store
- Check parameter path matches exactly: `/amplify/d162pvm3rcojvl/main/`
- Verify Amplify service role has SSM read permissions
- Check parameter names match exactly (case-sensitive)

### Issue: Environment variables not available in build
**Solution**:
- Ensure parameters are created before the build runs
- Check that parameter names match what Amplify expects
- Verify the Amplify app ID and branch name in the path

### Issue: SecureString parameters not decrypting
**Solution**:
- Ensure Amplify service role has KMS decrypt permissions
- Check that the KMS key used for encryption is accessible
- Verify parameter was created with `SecureString` type

## Important Notes

1. **Parameter Path**: The path must match exactly: `/amplify/{APP_ID}/{BRANCH_NAME}/`
   - Your APP_ID: `d162pvm3rcojvl`
   - Your BRANCH_NAME: `main` (or whatever branch you're deploying)

2. **Parameter Names**: Parameter names are case-sensitive and must match exactly

3. **SecureString**: Use `SecureString` type for sensitive values (passwords, secret keys)

4. **Frontend vs Backend**: 
   - Frontend parameters (like `VITE_API_URL`) are used during Amplify build
   - Backend parameters are used if you deploy backend via Amplify (not recommended)
   - If deploying backend separately, set parameters in that deployment's environment

5. **Cost**: Standard tier SSM parameters are free. Advanced tier costs $0.05 per parameter per month.

## Quick Setup Checklist

### Minimum Required for Frontend Build (Amplify)

- [ ] **VITE_API_URL** - Set to your production backend API URL
  - Example: `https://api.yourdomain.com/api`

### If Deploying Backend via Amplify (Not Recommended)

- [ ] **SECRET_KEY** - Generate Django secret key
- [ ] **DEBUG** - Set to `False`
- [ ] **ALLOWED_HOSTS** - Add your domain(s)
- [ ] **DB_NAME** - PostgreSQL database name
- [ ] **DB_USER** - PostgreSQL username
- [ ] **DB_PASSWORD** - PostgreSQL password (SecureString)
- [ ] **DB_HOST** - PostgreSQL host
- [ ] **DB_PORT** - PostgreSQL port (usually 5432)
- [ ] **CORS_ALLOWED_ORIGINS** - Add your frontend domain(s)

## Next Steps

1. Set up all required parameters in SSM Parameter Store
2. Verify Amplify service role has correct permissions
3. Trigger a new build in Amplify
4. Check build logs to confirm parameters are being retrieved
5. Test the deployed application

## Local Development (.env file)

For local development, create a `.env` file in the project root (see `ENV_SETUP.md` for details). The `.env` file is gitignored and should not be committed. Use `.env.example` as a template (create it manually if needed).

## Additional Resources

- [AWS Systems Manager Parameter Store Documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [AWS Amplify Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [AWS Amplify SSM Integration](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html#ssm-parameters)

