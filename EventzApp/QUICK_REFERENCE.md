# 🚀 Eventz Multi-Site Quick Reference

**Current Active Site**: `tdd-peru`

---

## ⚡ Common Commands

```bash
# Switch Sites
npm run switch:tdd-peru          # Switch to TDD Peru
npm run switch:tdd-talk          # Switch to TDD Talk

# Verify Configuration
npm run verify-env               # Check all configurations

# Development
npm run dev                      # Start dev server
npm run build                    # Build for production

# Deploy
npm run deploy:tdd-peru          # Deploy everything to TDD Peru
npm run deploy:tdd-talk          # Deploy everything to TDD Talk
npm run deploy:rules:tdd-peru    # Deploy only rules to TDD Peru
```

---

## 📋 Available Sites

| Site | Project ID | Status |
|------|------------|--------|
| **TDD Peru** | `tdd-peru` | ✅ Active |
| **TDD Talk** | `tdd-talk-prod` | 🟡 Standby |

---

## 🔄 Typical Workflows

### Start Working on TDD Peru
```bash
npm run switch:tdd-peru && npm run verify-env && npm run dev
```

### Switch to TDD Talk
```bash
npm run switch:tdd-talk && npm run verify-env && npm run dev
```

### Deploy Changes
```bash
npm run deploy:tdd-peru
```

### Deploy Only Security Rules
```bash
npm run deploy:rules:tdd-peru
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong database connected | `npm run switch:tdd-peru` |
| Configuration mismatch | `npm run verify-env` |
| Build errors after switch | `rm -rf .next && npm run build` |
| Authentication errors | `firebase login` |

---

## 📁 Important Files

- `.env` - Active site configuration
- `.firebaserc` - Firebase CLI project
- `firebase.json` - Firebase services config
- `scripts/` - Management scripts
- `MULTI_SITE_SETUP.md` - Full documentation

---

## 🔐 Current Configuration

**Project**: tdd-peru
**Storage**: tdd-peru.firebasestorage.app
**Admin Wallet**: 0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f

⚠️ **Security**: Development rules active (allow all access)

---

## 📞 Need Help?

1. Run `npm run verify-env` for diagnostics
2. Check `MULTI_SITE_SETUP.md` for detailed guide
3. Review Firebase Console for errors

---

**Last Updated**: 2025-11-06
