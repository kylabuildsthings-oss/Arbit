# GitHub Setup Guide

## Quick Start

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `arbit-trading-cards` (or your preferred name)
   - Choose public or private
   - Don't initialize with README (we already have one)

2. **Update repository URLs**
   - Edit `package.json` and replace `yourusername` with your GitHub username
   - Edit `README.md` and replace `<your-repo-url>` with your repository URL

3. **Initialize Git and push**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ARBIT Trading Cards"
   git branch -M main
   git remote add origin https://github.com/yourusername/arbit-trading-cards.git
   git push -u origin main
   ```

4. **Set up GitHub Secrets (for CI/CD)**
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `PEAR_CLIENT_ID`
     - `PEAR_CLIENT_SECRET`
     - `NEXT_PUBLIC_PEAR_API_URL`

5. **Configure GitHub Pages (optional)**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `out` folder

## Repository Settings

### Recommended Settings

- **General**
  - ✅ Issues: Enabled
  - ✅ Projects: Enabled
  - ✅ Wiki: Optional
  - ✅ Discussions: Optional

- **Actions**
  - ✅ Allow all actions and reusable workflows

- **Pages**
  - Source: GitHub Actions (for Next.js)

### Branch Protection (Optional)

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

## Badges (Optional)

Add to your README.md:

```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
```

## Next Steps

- [ ] Update package.json with your info
- [ ] Update README.md with your repository URL
- [ ] Add GitHub Secrets for CI/CD
- [ ] Create your first release
- [ ] Set up branch protection (optional)
- [ ] Add project description and topics on GitHub

## Topics to Add

On your GitHub repository, add these topics:
- `trading-cards`
- `crypto`
- `web3`
- `nextjs`
- `typescript`
- `pear-protocol`
- `trading`
