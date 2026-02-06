# 🚀 Quick Start: Link New EAS Account

## 3-Step Process

### Step 1️⃣: Clear Old Account & Cache
Run ONE of these commands:

**Windows PowerShell:**
```powershell
.\cleanup-eas.ps1
```

**Windows Command Prompt:**
```cmd
cleanup-eas.bat
```

**Manual (any OS):**
```bash
npx eas-cli logout
rm -rf ~/.eas ~/.expo  # macOS/Linux
rmdir %USERPROFILE%\.eas /s /q  # Windows (remove spaces in path if any)
```

### Step 2️⃣: Login with New Account
```bash
npx eas-cli login
```
- Follow browser prompts
- Use your NEW Expo account credentials
- Confirm in terminal when done

### Step 3️⃣: Build & Initialize
```bash
npx eas-cli build -p android --non-interactive
```
This will:
- ✅ Create a new project in your account
- ✅ Update app.json automatically
- ✅ Start your first build

## ✅ Verify Setup
```bash
npx eas-cli whoami
# Should show your NEW account name
```

## 📁 Files Created/Modified

✅ **Created:**
- `CLEANUP_OLD_EAS_ACCOUNT.md` - Detailed guide
- `EAS_ACCOUNT_RESET_SUMMARY.md` - Complete summary
- `cleanup-eas.bat` - Windows batch script
- `cleanup-eas.ps1` - Windows PowerShell script

✅ **Updated:**
- `SETUP_COMPLETED.md` - Removed old account references
- `BUILD_STATUS.md` - Updated links
- `BUILD_TROUBLESHOOTING.md` - Updated links
- `EAS_BUILD_PROGRESS.md` - Updated links

✅ **Verified:**
- `app.json` - Owner field is empty
- `eas.json` - No changes needed
- All project code - Untouched

## 🎯 What's Happening

**Your old account (samuel_mahama):** ❌ Disconnected
- Project ID `ef28131f-842c-44fa-9430-6d3ca93e41e7` is gone
- Build history from old account is not accessible
- All old account links removed from project

**Your new setup:** ✅ Ready
- All code preserved
- All build profiles intact
- All dependencies ready
- Project ready for fresh account

## 💡 Common Issues

**Issue:** Still see old account after logout
**Fix:** Run `rm -rf ~/.eas` (or equivalent for your OS)

**Issue:** Can't authenticate during login
**Fix:** Check your Expo account email/password, or use passwordless auth at https://expo.dev

**Issue:** Build fails after linking
**Fix:** Run `npx eas-cli build:list` to verify project was created

## 📞 Support

For detailed instructions, see:
- `CLEANUP_OLD_EAS_ACCOUNT.md` - Full cleanup guide
- `EAS_ACCOUNT_RESET_SUMMARY.md` - Comprehensive summary

For Expo help:
- Docs: https://docs.expo.dev/
- CLI: https://docs.expo.dev/eas-cli/

---

**Remember:** Once you run the cleanup script and login, you're all set! 🎉
