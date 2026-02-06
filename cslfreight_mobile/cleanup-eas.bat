@echo off
REM Clean Up Old EAS Account - Automated Cleanup Script for Windows
REM This script removes old EAS/Expo credentials and clears caches

echo.
echo ================================================
echo     EAS Account Cleanup Script
echo ================================================
echo.

REM Step 1: Logout from EAS
echo [1/5] Logging out from old EAS account...
call npx eas-cli logout
echo.

REM Step 2: Clear EAS cache
echo [2/5] Clearing EAS cache...
if exist "%USERPROFILE%\.eas" (
    echo     Removing %USERPROFILE%\.eas
    rmdir "%USERPROFILE%\.eas" /s /q
    echo     ✓ EAS cache cleared
) else (
    echo     ✓ No EAS cache found
)
echo.

REM Step 3: Clear Expo cache
echo [3/5] Clearing Expo cache...
if exist "%USERPROFILE%\.expo" (
    echo     Removing %USERPROFILE%\.expo
    rmdir "%USERPROFILE%\.expo" /s /q
    echo     ✓ Expo cache cleared
) else (
    echo     ✓ No Expo cache found
)
echo.

REM Step 4: Clear and reinstall node_modules
echo [4/5] Clearing and reinstalling node_modules...
if exist "node_modules" (
    echo     Removing node_modules folder...
    rmdir "node_modules" /s /q
    echo     ✓ Old node_modules removed
    echo     Installing fresh dependencies...
    call npm install
    echo     ✓ Dependencies installed
) else (
    echo     Installing dependencies...
    call npm install
)
echo.

REM Step 5: Verify logout
echo [5/5] Verifying logout status...
call npx eas-cli whoami
echo.

echo ================================================
echo     Cleanup Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Run: npx eas-cli login
echo   2. Sign in with your new Expo account
echo   3. Run: npx eas-cli build -p android --non-interactive
echo.
echo For detailed instructions, see: CLEANUP_OLD_EAS_ACCOUNT.md
echo.
pause
