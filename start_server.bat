@echo off
REM Start the frontend server

start cmd /k "pnpm install && pnpm run dev"
REM Start the frontend server
cd Backend
start cmd /k "pnpm install && pnpm run gg"

