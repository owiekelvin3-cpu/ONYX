@echo off
REM Push ONYX Exchange to GitHub
set PATH=%PATH%;%ProgramFiles%\GitHub CLI

echo Checking GitHub auth...
gh auth status
if errorlevel 1 (
  echo.
  echo Please log in to GitHub when prompted...
  gh auth login --hostname github.com --git-protocol https --web
)

echo Pushing to GitHub...
git remote set-url origin https://github.com/owiekelvin3-cpu/ONYX.git
git push -u origin main

echo.
echo Done! Repository: https://github.com/owiekelvin3-cpu/ONYX
