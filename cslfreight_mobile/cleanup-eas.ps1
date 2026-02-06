# Clean Up Old EAS Account - PowerShell Script for Windows
# This script removes old EAS/Expo credentials and clears caches

Write-Host ""
Write-Host "================================================"
Write-Host "     EAS Account Cleanup Script"
Write-Host "================================================"
Write-Host ""

# Step 1: Logout from EAS
Write-Host "[1/5] Logging out from old EAS account..."
& npx eas-cli logout
Write-Host ""

# Step 2: Clear EAS cache
Write-Host "[2/5] Clearing EAS cache..."
$easPath = "$env:USERPROFILE\.eas"
if (Test-Path $easPath) {
    Write-Host "     Removing $easPath"
    Remove-Item $easPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "     ✓ EAS cache cleared"
} else {
    Write-Host "     ✓ No EAS cache found"
}
Write-Host ""

# Step 3: Clear Expo cache
Write-Host "[3/5] Clearing Expo cache..."
$expoPath = "$env:USERPROFILE\.expo"
if (Test-Path $expoPath) {
    Write-Host "     Removing $expoPath"
    Remove-Item $expoPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "     ✓ Expo cache cleared"
} else {
    Write-Host "     ✓ No Expo cache found"
}
Write-Host ""

# Step 4: Clear and reinstall node_modules
Write-Host "[4/5] Clearing and reinstalling node_modules..."
$nodeModulesPath = "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "     Removing node_modules folder..."
    Remove-Item $nodeModulesPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "     ✓ Old node_modules removed"
    Write-Host "     Installing fresh dependencies..."
    & npm install
    Write-Host "     ✓ Dependencies installed"
} else {
    Write-Host "     Installing dependencies..."
    & npm install
}
Write-Host ""

# Step 5: Verify logout
Write-Host "[5/5] Verifying logout status..."
& npx eas-cli whoami
Write-Host ""

Write-Host "================================================"
Write-Host "     Cleanup Complete!"
Write-Host "================================================"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Run: npx eas-cli login"
Write-Host "  2. Sign in with your new Expo account"
Write-Host "  3. Run: npx eas-cli build -p android --non-interactive"
Write-Host ""
Write-Host "For detailed instructions, see: CLEANUP_OLD_EAS_ACCOUNT.md"
Write-Host ""
