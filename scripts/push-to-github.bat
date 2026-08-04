@echo off
REM One-time setup: authenticate with GitHub and push ONYX Exchange
set PATH=%PATH%;%ProgramFiles%\GitHub CLI

echo Checking GitHub auth...
gh auth status
if errorlevel 1 (
  echo.
  echo Please log in to GitHub when prompted...
  gh auth login --hostname github.com --git-protocol https --web
)

echo Creating GitHub repo and pushing...
gh repo create onyx-exchange --public --source=. --remote=origin --push --description "ONYX Exchange - crypto trading platform"

echo.
echo Done! Repository: https://github.com/owiekelvin3-cpu/onyx-exchange
echo.
echo Connect to Vercel:
echo   npx vercel link
echo   npx vercel git connect
