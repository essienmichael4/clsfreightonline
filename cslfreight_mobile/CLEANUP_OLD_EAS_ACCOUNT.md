# Clean Up Old EAS Account - Complete Guide

## 🧹 What Has Been Cleaned

The following old account references have been removed:
- ✅ Owner field in `app.json`
- ✅ SETUP_COMPLETED.md documentation updated
- ✅ Project is now ready for new account linking

## 🔐 Additional Local Cleanup (Manual Steps)

To completely remove all traces of the old EAS account from your system:

### Step 1: Clear EAS Cache
```bash
# Windows
rmdir %USERPROFILE%\.eas /s /q

# macOS/Linux
rm -rf ~/.eas
```

### Step 2: Clear Expo Cache
```bash
# Windows
rmdir %USERPROFILE%\.expo /s /q

# macOS/Linux
rm -rf ~/.expo
```

### Step 3: Clear Node Modules and Reinstall
```bash
# Windows
rmdir node_modules /s /q
npm install

# macOS/Linux
rm -rf node_modules
npm install
```

### Step 4: Verify Old Credentials Are Gone
```bash
# Check if eas-cli is logged out
npx eas-cli whoami
# Should return: "You are not authenticated"
```

## 🔗 Steps to Link New EAS Account

### 1. Log In with Your New Account
```bash
npx eas-cli login
```
Follow the prompts:
- Go to the URL provided
- Sign in to your new Expo account
- Return to terminal and confirm

### 2. Initialize Project with New Account
```bash
# Option A: Let EAS create a new project
npx eas-cli build -p android --non-interactive

# Option B: Use specific project ID
npx eas-cli init --id <your-new-project-id>
```

### 3. Verify New Account is Linked
```bash
npx eas-cli whoami
# Should show your new account name
```

### 4. Verify app.json is Updated
Check that `app.json` now contains your new owner:
```json
{
  "expo": {
    "owner": "your-new-username",
    ...
  }
}
```

## 🚀 Build with New Account

Once linked to new account:

```bash
# Build for Android
npx eas-cli build -p android --non-interactive

# View builds
npx eas-cli build:list

# Check specific build
npx eas-cli build:view <build-id>
```

## ❓ Troubleshooting

### Issue: Still seeing old account
**Solution:**
```bash
# Force logout
npx eas-cli logout

# Clear all local EAS data
rmdir %USERPROFILE%\.eas /s /q  # Windows
rm -rf ~/.eas                    # macOS/Linux

# Login again
npx eas-cli login
```

### Issue: Project ID conflicts
**Solution:**
- The old project ID is no longer stored in this project
- A new project ID will be created when you initialize with the new account
- Update will be automatic and reflected in app.json

### Issue: Build fails with authorization error
**Solution:**
```bash
# Verify you're logged in
npx eas-cli whoami

# Re-authenticate if needed
npx eas-cli logout
npx eas-cli login

# Try build again
npx eas-cli build -p android --non-interactive
```

## 📁 Files Modified/Cleaned

- `app.json` - Owner field reset
- `SETUP_COMPLETED.md` - Documentation updated
- `.expo/` - Can be safely regenerated
- No changes to `eas.json` - Safe to use with new account

## ✨ Next Steps

1. Run the manual cleanup steps above
2. Log in with your new account
3. Initialize the project with new account
4. Run your first build
5. Verify everything works!

---

**Important:** The old project cannot be accessed with this codebase anymore. All references have been cleaned. You're starting fresh! 🎉
