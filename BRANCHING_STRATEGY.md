# Branching Strategy Guide
## Git Workflow for Payton Place Development

This document explains the branching strategy and development workflow for the Payton Place project.

---

## 🌳 Branch Structure

### **Main Branches**

#### 1. `main` (Production Branch)
- **Purpose**: Production-ready code only
- **Protection**: Protected branch (recommended)
- **Deployment**: Auto-deploys to https://payton-place.mbartonportfolio.space
- **Rules**:
  - ✅ Only merge from `develop` branch
  - ✅ Every commit triggers automatic deployment
  - ✅ Should always be stable and deployable
  - ❌ Never commit directly to `main`

#### 2. `develop` (Development/Staging Branch)
- **Purpose**: Integration branch for features and fixes
- **Deployment**: Builds and tests only (no auto-deploy)
- **Rules**:
  - ✅ Merge feature branches here
  - ✅ Test thoroughly before merging to `main`
  - ✅ CI/CD runs build and tests
  - ✅ Can commit directly for small changes

### **Supporting Branches**

#### Feature Branches (optional for larger features)
- **Naming**: `feature/feature-name`
- **Purpose**: Develop new features in isolation
- **Base**: Created from `develop`
- **Merge Into**: `develop`
- **Lifetime**: Temporary (delete after merge)

#### Hotfix Branches (optional for urgent production fixes)
- **Naming**: `hotfix/issue-description`
- **Purpose**: Critical production bug fixes
- **Base**: Created from `main`
- **Merge Into**: Both `main` AND `develop`
- **Lifetime**: Temporary (delete after merge)

---

## 🔄 Development Workflows

### Workflow 1: Regular Development (Most Common)

**For small changes, bug fixes, and regular features:**

```bash
# 1. Switch to develop branch
git checkout develop

# 2. Pull latest changes
git pull origin develop

# 3. Make your changes
# ... edit files ...

# 4. Test locally
cd frontend && npm run build
cd ../backend && npm run build

# 5. Commit and push to develop
git add .
git commit -m "Add new team member management feature"
git push origin develop

# ✅ GitHub Actions runs build/test automatically
# ⚠️  Does NOT deploy to production yet
```

**When ready for production:**

```bash
# 6. Merge to main
git checkout main
git pull origin main
git merge develop

# 7. Push to main (triggers auto-deploy)
git push origin main

# 🚀 Automatic deployment to production!
# ⏱️  Takes ~2-3 minutes
# ✅ No PuTTY needed!
```

---

### Workflow 2: Feature Branch (For Larger Features)

**When working on a significant feature:**

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/advanced-search

# 2. Work on your feature
# ... make changes ...

# 3. Commit regularly
git add .
git commit -m "WIP: Add search functionality"
git push origin feature/advanced-search

# 4. When feature is complete, merge to develop
git checkout develop
git pull origin develop
git merge feature/advanced-search

# 5. Push develop (triggers build/test)
git push origin develop

# 6. Delete feature branch (cleanup)
git branch -d feature/advanced-search
git push origin --delete feature/advanced-search

# 7. When ready, merge develop to main for production
git checkout main
git merge develop
git push origin main  # Auto-deploys!
```

---

### Workflow 3: Hotfix (Urgent Production Fix)

**When production has a critical bug:**

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/fix-login-bug

# 2. Fix the bug
# ... make fix ...

# 3. Test the fix
npm run build
# Test thoroughly!

# 4. Merge to main first (deploy ASAP)
git checkout main
git merge hotfix/fix-login-bug
git push origin main  # Auto-deploys immediately!

# 5. Also merge to develop (keep branches in sync)
git checkout develop
git merge hotfix/fix-login-bug
git push origin develop

# 6. Delete hotfix branch
git branch -d hotfix/fix-login-bug
git push origin --delete hotfix/fix-login-bug
```

---

## 📊 Branch Diagram

```
main (production)     ──●────●──────────●──────────●──────>
                        │    │          │          │
                        │    │  merge   │  merge   │
                        │    │          │          │
develop (staging)    ──●────●──●───●───●──●───●───●──────>
                           │      │       │   │
                           │      │       │   │
feature/new-ui          ───●──────●───────┘   │
                                               │
feature/api-v2          ───────────●───────────●───────────┘
```

**Legend:**
- ● Commit
- ─ Branch timeline
- Merges flow upward (develop → main)

---

## 🎯 Quick Decision Guide

### "Where should I work?"

| Scenario | Branch to Use |
|----------|---------------|
| Small bug fix | `develop` |
| New feature (simple) | `develop` |
| Large feature (complex) | `feature/feature-name` → merge to `develop` |
| Production is broken! | `hotfix/fix-name` → merge to `main` AND `develop` |
| Testing before showing client | `develop` (test locally or on staging if set up) |
| Ready to show client | Merge `develop` → `main` (auto-deploys) |

---

## ✅ Best Practices

### 1. Commit Messages

**Good commit messages:**
```bash
git commit -m "Add team member photo upload functionality"
git commit -m "Fix login redirect bug on admin panel"
git commit -m "Update service card styling for mobile"
```

**Bad commit messages:**
```bash
git commit -m "fix"
git commit -m "changes"
git commit -m "stuff"
```

**Template:**
```
<type>: <description>

[optional body]

Examples:
- Add: New feature or functionality
- Fix: Bug fix
- Update: Improve existing feature
- Refactor: Code restructuring without changing functionality
- Docs: Documentation only changes
```

### 2. Pull Before Push

**Always pull before pushing:**
```bash
git pull origin develop
# ... make changes ...
git push origin develop
```

This prevents merge conflicts.

### 3. Test Before Merging to Main

**Before merging to `main`:**
```bash
# 1. Test build locally
cd frontend && npm run build
cd ../backend && npm run build

# 2. Test in browser locally
# Visit http://localhost:5173

# 3. Check develop branch CI passed
# Check GitHub Actions tab

# 4. Then merge to main
git checkout main
git merge develop
git push origin main
```

### 4. Keep Branches Synced

**Regularly update develop from main:**
```bash
git checkout develop
git merge main
git push origin develop
```

This keeps branches in sync, especially after hotfixes.

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't: Commit directly to `main`
```bash
# BAD:
git checkout main
git add .
git commit -m "Quick fix"
git push origin main
```

### ✅ Do: Use `develop` first
```bash
# GOOD:
git checkout develop
git add .
git commit -m "Fix navigation bug"
git push origin develop
# Test, then merge to main
```

---

### ❌ Don't: Forget to pull before starting work
```bash
# BAD:
# ... make changes without pulling ...
git push  # Merge conflict!
```

### ✅ Do: Always pull first
```bash
# GOOD:
git checkout develop
git pull origin develop
# ... make changes ...
git push origin develop
```

---

### ❌ Don't: Merge untested code to `main`
```bash
# BAD:
git checkout main
git merge develop  # Haven't tested develop!
git push origin main  # Deploys broken code!
```

### ✅ Do: Test `develop` first
```bash
# GOOD:
# Push to develop
git checkout develop
git push origin develop
# Check GitHub Actions - build passed?
# Test locally?
# Then merge to main
git checkout main
git merge develop
git push origin main
```

---

## 📱 GitHub Pull Requests (Optional)

For team collaboration or code review, use Pull Requests:

### Creating a PR

1. Push your feature branch to GitHub:
   ```bash
   git push origin feature/my-feature
   ```

2. Go to GitHub repository
3. Click "Compare & pull request"
4. Set:
   - **Base**: `develop`
   - **Compare**: `feature/my-feature`
5. Add description
6. Click "Create pull request"

### Merging a PR

1. Review code changes
2. Check that CI/CD passed
3. Click "Merge pull request"
4. Delete feature branch

---

## 🔍 Checking Branch Status

### See all branches
```bash
git branch -a
```

### See current branch
```bash
git branch
# or
git status
```

### See branch differences
```bash
# What's in develop that's not in main?
git log main..develop

# What's in main that's not in develop?
git log develop..main
```

---

## 📋 Quick Reference Commands

```bash
# Switch branches
git checkout main
git checkout develop

# Create and switch to new branch
git checkout -b feature/new-feature

# Update current branch from remote
git pull origin develop

# Merge branch into current branch
git merge develop

# Push to remote
git push origin develop

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# See what changed
git status
git diff

# See commit history
git log --oneline --graph --all
```

---

## 🎊 Summary

### Your Standard Workflow:

1. **Work on `develop`** for all changes
2. **Push to `develop`** (triggers build/test)
3. **Test thoroughly**
4. **Merge to `main`** when ready for production
5. **Push to `main`** (auto-deploys!)

**Simple as that!** 🚀

---

**Created by Claude Code**
Generated: 2025-10-11
