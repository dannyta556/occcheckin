@echo off

:: Open a new terminal and navigate to the frontend folder
start cmd /k "cd /d %~dp0frontend && npm run start"

:: Open another terminal and navigate to the backend folder
start cmd /k "cd /d %~dp0backend && npm start"