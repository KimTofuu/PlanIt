@echo off
echo Starting development servers...

start "Frontend" cmd /k "npm run dev"

echo Frontend: http://localhost:3000
echo Press any key to continue...
pause