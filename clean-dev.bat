@echo off
REM Next dev HMR 캐시(.next)가 깨져 500 / Cannot find module './xxx.js' 가 날 때 사용
cd /d "%~dp0"
echo Stopping dev server on port 3040 if running...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3040 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
if exist .next rmdir /s /q .next
echo .next removed.
echo Starting dev server...
call npm.cmd run dev
