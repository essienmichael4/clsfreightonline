# EAS Build Setup - Account Reset

## ⚠️ Old Account Removed

The project has been cleared of all EAS account links from the old account (samuel_mahama). You can now link this project to a new Expo account.

## 🔧 Steps to Link New EAS Account

### 1. Log Out of Old Account
```bash
npx eas-cli logout
```

### 2. Log In with New Account
```bash
npx eas-cli login
# Follow the prompts to login with your new Expo account
```

### 3. Initialize/Link Project to New Account
```bash
npx eas-cli init --id <new-project-id>
# Or to create a new project:
npx eas-cli build --platform android --non-interactive
# This will prompt you to create a new project in your new account
```

### 4. Verify New Account Link
```bash
npx eas-cli whoami
# Should show your new account name
```

## 📋 Project Configuration

**Current Setup:**
- **Android Package:** com.csl.freight.mobile
- **iOS Bundle ID:** com.csl.freight.mobile
- **App Name:** CSL Freight Mobile
- **EAS Version Required:** >= 16.28.0

## 🚀 Building with New Account

### Android Build
```bash
npx eas-cli build -p android --non-interactive
```

### Android Build (Preview)
```bash
npx eas-cli build -p android --non-interactive --profile preview
```

### Android Build (Development)
```bash
npx eas-cli build -p android --non-interactive --profile development
```

## 📝 Useful Commands

```bash
# Check current EAS account
npx eas-cli whoami

# List all builds for current project
npx eas-cli build:list

# View specific build details
npx eas-cli build:view <build-id>

# Download build artifacts
npx eas-cli build:download <build-id>

# Configure environment variables
npx eas-cli env --platform android
```

## ✨ Files Cleaned

1. ✅ Removed owner reference from app.json
2. ✅ Removed old account references from documentation
3. ✅ Preserved all EAS configuration in eas.json
4. ✅ Git repository ready for new account
5. ✅ .expo and device cache can be regenerated

---

**Date:** January 21, 2026
**Status:** Ready to link to new EAS account
