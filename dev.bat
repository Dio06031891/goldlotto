@echo off

cd /d "%~dp0"

REM HMR 캐시 꼬임(500, Cannot find module './xxx.js') 방지 — 기본으로 .next 삭제 후 시작

REM 빠른 재시작: dev.bat --fast

if /I not "%~1"=="--fast" (

  if exist .next (

    echo [dev.bat] .next 캐시 삭제 중...

    rmdir /s /q .next

  )

)

call npm.cmd run dev

