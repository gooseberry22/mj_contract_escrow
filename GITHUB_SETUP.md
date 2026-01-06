# GitHub Repository Setup

## Steps to Create and Connect GitHub Repository

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `surrogate-escrow-website` (or your preferred name)
5. Description: "Surrogate Escrow Website - Django backend and React frontend"
6. Choose **Private** or **Public** (your preference)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

### 2. Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin main
```

### 3. Alternative: Using SSH (if you have SSH keys set up)

```bash
# Add the remote repository (SSH)
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code to GitHub
git push -u origin main
```

### 4. Verify

After pushing, refresh your GitHub repository page. You should see all your files there.

## Future Updates

To push future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Important Notes

- Never commit `.env` files or sensitive data
- The `.gitignore` file is already configured to exclude:
  - Environment variables (`.env`, `.env.prod`, etc.)
  - Database files (`db.sqlite3`)
  - `node_modules/`
  - `__pycache__/`
  - Build artifacts
  - IDE settings



