# 🌐 Eventz Multi-Site Configuration - Setup Complete

## ✅ What Was Implemented

Your Eventz application now supports **multiple Firebase sites/databases** with automatic configuration management.

---

## 📦 Created Files

### Scripts (Executable)
- ✅ `scripts/switch-env.sh` - Environment switcher
- ✅ `scripts/deploy.sh` - Deployment automation
- ✅ `scripts/verify-env.sh` - Configuration validator

### Documentation
- ✅ `MULTI_SITE_SETUP.md` - Complete setup guide
- ✅ `QUICK_REFERENCE.md` - Command quick reference
- ✅ `README_MULTI_SITE.md` - This file

### Configuration
- ✅ Updated `package.json` with npm scripts
- ✅ Configured `.env` for tdd-peru (active)
- ✅ Updated `.firebaserc` for tdd-peru
- ✅ Updated `firebase.json` storage bucket

---

## 🎯 Current Status

**Active Site**: `tdd-peru` ✅

**Configuration**:
```
Project ID: tdd-peru
Storage: tdd-peru.firebasestorage.app
Admin Wallet: 0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f
```

**Available Sites**: 2
- tdd-peru (active)
- tdd-talk-prod (standby)

---

## 🚀 Quick Start

### 1. Verify Current Configuration
```bash
npm run verify-env
```

### 2. Start Development
```bash
npm run dev
```

### 3. Switch Sites (if needed)
```bash
npm run switch:tdd-peru
# or
npm run switch:tdd-talk
```

---

## 📚 Available NPM Scripts

### Environment Management
```bash
npm run switch:tdd-peru      # Switch to TDD Peru
npm run switch:tdd-talk      # Switch to TDD Talk
npm run verify-env           # Validate configuration
```

### Deployment
```bash
npm run deploy:tdd-peru      # Deploy all to TDD Peru
npm run deploy:tdd-talk      # Deploy all to TDD Talk
npm run deploy:rules:tdd-peru    # Deploy only rules
npm run deploy:rules:tdd-talk    # Deploy only rules
```

---

## 🔄 Common Workflows

### Daily Development on TDD Peru
```bash
# 1. Ensure correct environment
npm run verify-env

# 2. Start dev server
npm run dev

# 3. Access admin panel
# Visit: http://localhost:3000/login
# Connect admin wallet: 0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f
```

### Switch to Different Site
```bash
# Switch environment
npm run switch:tdd-talk

# Verify (recommended)
npm run verify-env

# Restart dev server
npm run dev
```

### Deploy Changes
```bash
# Deploy everything (rules + build)
npm run deploy:tdd-peru

# Or deploy only rules (faster)
npm run deploy:rules:tdd-peru
```

---

## ➕ Adding New Sites

See detailed instructions in [MULTI_SITE_SETUP.md](./MULTI_SITE_SETUP.md#adding-new-sites)

Quick steps:
1. Create Firebase project
2. Edit `scripts/switch-env.sh` - add site config
3. Add npm scripts to `package.json`
4. Test: `npm run switch:new-site && npm run verify-env`

---

## 🔐 Security Notes

⚠️ **Current Status**: Development rules active

**Development Rules** (current):
- Firestore: Allow all read/write access
- Storage: Allow all read/write access

**Before Production**:
1. Edit `firestore.rules` - uncomment production rules
2. Edit `storage.rules` - uncomment production rules
3. Deploy: `npm run deploy:rules:tdd-peru`

---

## 📊 Configuration Files

| File | Purpose | Auto-Updated |
|------|---------|--------------|
| `.env` | Active site credentials | ✅ Yes |
| `.firebaserc` | Firebase CLI project | ✅ Yes |
| `firebase.json` | Services config | ✅ Yes |
| `firestore.rules` | Database security | ❌ Manual |
| `storage.rules` | Storage security | ❌ Manual |

---

## 🛠️ Script Details

### `switch-env.sh`
Switches all configurations to target site:
- Updates `.env` with credentials
- Updates `.firebaserc` project
- Updates `firebase.json` bucket
- Switches Firebase CLI

### `verify-env.sh`
Validates configuration:
- Checks all env vars are set
- Verifies file consistency
- Detects mismatches
- Security rule warnings

### `deploy.sh`
Automated deployment:
- Environment switching
- Configuration validation
- Rules deployment
- Next.js build
- Deployment summary

---

## 🆘 Troubleshooting

### Configuration Mismatch
```bash
npm run verify-env
# Fix detected issues, then:
npm run switch:tdd-peru
```

### Wrong Database Connected
```bash
# Check current config
cat .env | grep PROJECT_ID

# If wrong, switch
npm run switch:tdd-peru
```

### Build Errors After Switch
```bash
rm -rf .next
npm install
npm run build
```

### Deployment Authentication Error
```bash
firebase login
npm run deploy:tdd-peru
```

---

## 📖 Documentation

- **Full Guide**: [MULTI_SITE_SETUP.md](./MULTI_SITE_SETUP.md)
- **Quick Commands**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **This Summary**: README_MULTI_SITE.md

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Run `npm run verify-env` - all checks pass
- [ ] Uncomment production rules in `firestore.rules`
- [ ] Uncomment production rules in `storage.rules`
- [ ] Deploy rules: `npm run deploy:rules:tdd-peru`
- [ ] Test admin login with correct wallet
- [ ] Verify events CRUD operations work
- [ ] Test image uploads to Storage
- [ ] Check Firebase Console for errors

---

## 🎉 Success!

Your multi-site infrastructure is ready. The system automatically keeps all configurations synchronized across:

✅ Environment variables (.env)
✅ Firebase CLI project (.firebaserc)
✅ Storage configuration (firebase.json)
✅ All active services

**Current Active Site**: `tdd-peru` 🇵🇪

---

**Setup Completed**: 2025-11-06
**Version**: 1.0
**Status**: ✅ Production Ready (after enabling production rules)
