# 🌐 Eventz Multi-Site Management Guide

Complete guide for managing multiple Firebase sites/databases with Eventz.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Available Sites](#available-sites)
- [Quick Start](#quick-start)
- [Scripts Reference](#scripts-reference)
- [Workflows](#workflows)
- [Adding New Sites](#adding-new-sites)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Eventz supports multiple Firebase sites, each with its own database, storage, and configuration. The multi-site system ensures all configurations stay synchronized through automated scripts.

**Current Active Site**: `tdd-peru`

### Architecture

```
Eventz
├── .env                    # Active site configuration
├── .firebaserc             # Firebase CLI project
├── firebase.json           # Firebase services config
├── scripts/
│   ├── switch-env.sh      # Environment switcher
│   ├── deploy.sh          # Deployment automation
│   └── verify-env.sh      # Configuration validator
```

---

## 🏢 Available Sites

### 1. TDD Peru (Active)
- **Project ID**: `tdd-peru`
- **Storage**: `tdd-peru.firebasestorage.app`
- **Admin Wallet**: `0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f`
- **Status**: ✅ Active
- **Created**: 2025-11-06

### 2. TDD Talk Production
- **Project ID**: `tdd-talk-prod`
- **Storage**: `tdd-talk-prod.firebasestorage.app`
- **Admin Wallet**: `0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f`
- **Status**: 🟡 Standby

---

## 🚀 Quick Start

### Switch to a Site

```bash
# Switch to TDD Peru
npm run switch:tdd-peru

# Switch to TDD Talk
npm run switch:tdd-talk

# Generic switch
npm run switch-env tdd-peru
```

### Verify Configuration

```bash
npm run verify-env
```

### Deploy

```bash
# Deploy everything (rules + build)
npm run deploy:tdd-peru

# Deploy only rules
npm run deploy:rules:tdd-peru
```

---

## 📚 Scripts Reference

### 1. `switch-env.sh`

**Purpose**: Switch between Firebase sites/databases

**Usage**:
```bash
./scripts/switch-env.sh <site-name>
npm run switch:tdd-peru
npm run switch:tdd-talk
```

**What it does**:
1. ✅ Updates `.env` with site credentials
2. ✅ Updates `.firebaserc` project
3. ✅ Updates `firebase.json` storage bucket
4. ✅ Switches Firebase CLI project

**Output Example**:
```
🔄 Switching to site: tdd-peru

✓ Updating .env file...
✓ Updating .firebaserc...
✓ Updating firebase.json...
✓ Switching Firebase CLI project...

✅ Successfully switched to tdd-peru

Configuration:
  Project ID: tdd-peru
  Storage Bucket: tdd-peru.firebasestorage.app
  Admin Wallet: 0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f
```

---

### 2. `verify-env.sh`

**Purpose**: Validate environment configuration and detect mismatches

**Usage**:
```bash
./scripts/verify-env.sh
npm run verify-env
```

**Checks**:
- ✅ All required environment variables are set
- ✅ Firebase configuration files exist
- ✅ `.env` PROJECT_ID matches Firebase CLI
- ✅ `.env` STORAGE_BUCKET matches `firebase.json`
- ✅ `.firebaserc` matches Firebase CLI
- ⚠️ Security rules configuration
- ⚠️ `.env` is in `.gitignore`

**Output Example**:
```
═══════════════════════════════════════════════════
   Eventz Environment Configuration Validator
═══════════════════════════════════════════════════

Checking .env configuration...
✓ NEXT_PUBLIC_FIREBASE_API_KEY is set
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID is set
...

Checking configuration consistency...
✓ .env PROJECT_ID matches Firebase CLI project (tdd-peru)
✓ .env STORAGE_BUCKET matches firebase.json
...

✅ All checks passed! Configuration is valid.
```

---

### 3. `deploy.sh`

**Purpose**: Deploy site with proper environment switching and validation

**Usage**:
```bash
./scripts/deploy.sh <site-name> [--all|--rules-only|--hosting-only]

# Examples
npm run deploy:tdd-peru          # Deploy everything
npm run deploy:rules:tdd-peru    # Deploy only rules
npm run deploy:tdd-talk          # Deploy TDD Talk
```

**What it does**:
1. 🔄 Switch to target environment
2. ✅ Verify configuration
3. 📤 Deploy Firestore rules (optional)
4. 📤 Deploy Storage rules (optional)
5. 🏗️ Build Next.js application (optional)
6. 📊 Show deployment summary

**Output Example**:
```
═══════════════════════════════════════════════════
   Eventz Multi-Site Deployment
═══════════════════════════════════════════════════

Step 1/5: Switching environment to tdd-peru
Step 2/5: Verifying environment configuration
Step 3/5: Deploying Firestore and Storage rules
Step 4/5: Building Next.js application
Step 5/5: Deployment Summary

═══════════════════════════════════════════════════
   ✅ Deployment Completed Successfully
═══════════════════════════════════════════════════
```

---

## 🔄 Common Workflows

### Starting Development

```bash
# 1. Switch to desired site
npm run switch:tdd-peru

# 2. Verify configuration
npm run verify-env

# 3. Start development server
npm run dev
```

---

### Deploying Changes

```bash
# Deploy all changes
npm run deploy:tdd-peru

# Deploy only rules (no build)
npm run deploy:rules:tdd-peru
```

---

### Switching Between Sites

```bash
# Current site: tdd-peru
# Need to switch to: tdd-talk

# 1. Switch environment
npm run switch:tdd-talk

# 2. Verify (recommended)
npm run verify-env

# 3. Restart dev server
npm run dev
```

---

### Adding Test Data

```bash
# 1. Switch to target site
npm run switch:tdd-peru

# 2. Start dev server
npm run dev

# 3. Login with admin wallet
# Visit: http://localhost:3000/login

# 4. Access admin dashboard
# Visit: http://localhost:3000/admin
```

---

## ➕ Adding New Sites

To add a new Firebase site to the system:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project (e.g., `tdd-mexico`)
3. Enable Firestore and Storage
4. Get configuration values

### Step 2: Update Scripts

Edit `scripts/switch-env.sh` and add site configuration:

```bash
# TDD Mexico Configuration
SITES[tdd-mexico.project_id]="tdd-mexico"
SITES[tdd-mexico.api_key]="YOUR_API_KEY"
SITES[tdd-mexico.auth_domain]="tdd-mexico.firebaseapp.com"
SITES[tdd-mexico.storage_bucket]="tdd-mexico.firebasestorage.app"
SITES[tdd-mexico.messaging_sender_id]="YOUR_SENDER_ID"
SITES[tdd-mexico.app_id]="YOUR_APP_ID"
SITES[tdd-mexico.admin_wallet]="0xYourAdminWallet"
```

### Step 3: Add NPM Scripts

Edit `package.json`:

```json
{
  "scripts": {
    "switch:tdd-mexico": "bash scripts/switch-env.sh tdd-mexico",
    "deploy:tdd-mexico": "bash scripts/deploy.sh tdd-mexico --all",
    "deploy:rules:tdd-mexico": "bash scripts/deploy.sh tdd-mexico --rules-only"
  }
}
```

### Step 4: Test Configuration

```bash
# Switch to new site
npm run switch:tdd-mexico

# Verify configuration
npm run verify-env

# Deploy rules
npm run deploy:rules:tdd-mexico
```

---

## 🔧 Troubleshooting

### Configuration Mismatch Error

**Problem**: `.env` PROJECT_ID doesn't match Firebase CLI

**Solution**:
```bash
npm run switch:tdd-peru
npm run verify-env
```

---

### Deployment Fails

**Problem**: Deployment fails with authentication error

**Solution**:
```bash
# Re-authenticate with Firebase
firebase login

# Try deployment again
npm run deploy:tdd-peru
```

---

### Wrong Database Connection

**Problem**: App connects to wrong Firebase database

**Symptoms**:
- Events from different site appear
- Wrong admin access

**Solution**:
```bash
# Check current configuration
npm run verify-env

# Switch to correct site
npm run switch:tdd-peru

# Restart dev server
npm run dev
```

---

### Build Errors After Switch

**Problem**: Build fails after switching sites

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies (if needed)
npm install

# Rebuild
npm run build
```

---

### Storage Bucket Not Found

**Problem**: Images not loading, storage errors

**Solution**:
```bash
# Verify storage bucket matches
npm run verify-env

# If mismatch detected, re-switch
npm run switch:tdd-peru
```

---

## 🔐 Security Best Practices

### Development vs Production Rules

**Current Status**: Development rules active (⚠️ allow all access)

**Before Production**:

1. Edit `firestore.rules` - uncomment production rules
2. Edit `storage.rules` - uncomment production rules
3. Deploy rules: `npm run deploy:rules:tdd-peru`

### Environment Variables

- ✅ `.env` is gitignored
- ✅ Never commit credentials
- ✅ Use separate admin wallets per environment (recommended)

### Firebase Project Isolation

- Each site has isolated database
- Separate storage buckets
- Independent security rules
- No cross-site data sharing

---

## 📊 Configuration Files

### `.env`
Active site credentials and configuration

### `.firebaserc`
Firebase CLI active project

### `firebase.json`
Firebase services configuration (Firestore, Storage)

### `firestore.rules`
Database security rules

### `storage.rules`
Storage security rules

---

## 🎯 Current Status Summary

| Component | Site | Status |
|-----------|------|--------|
| **Active Site** | tdd-peru | ✅ |
| **Firebase CLI** | tdd-peru | ✅ |
| **Storage Bucket** | tdd-peru.firebasestorage.app | ✅ |
| **Environment** | Development | ⚠️ |
| **Security Rules** | Development Mode | ⚠️ |

---

## 📞 Support

For issues or questions:
1. Run `npm run verify-env` for diagnostics
2. Check this documentation
3. Review Firebase Console logs
4. Contact development team

---

**Last Updated**: 2025-11-06
**Active Site**: tdd-peru
**Configuration Version**: 1.0
