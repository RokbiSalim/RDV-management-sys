@echo off
REM Copy project to local path (avoids OneDrive path issues) and start backend + frontend
SETLOCAL ENABLEDELAYEDEXPANSION
set SRC_DIR=%~dp0
set DEST_DIR=C:\rdv_local
echo Copying project from "%SRC_DIR%" to "%DEST_DIR%" (this may take a while)...
robocopy "%SRC_DIR%" "%DEST_DIR%" /MIR /XD node_modules .git target build .venv frontend\node_modules frontend\.vite >NUL
if ERRORLEVEL 8 (
  echo Robocopy failed with an error code %ERRORLEVEL%. Please run manually.
  goto :end
)
echo Copy complete.

REM Ensure Java is available
java -version >NUL 2>&1
if ERRORLEVEL 1 (
  echo Java not found on PATH. Install Java 17+ and retry.
  goto :end
)

REM Start backend in new window
if exist "%DEST_DIR%\backend\Stage-Marsa-RDV-Management-backend\mvnw.cmd" (
  start "RDV Backend" cmd /k "cd /d %DEST_DIR%\backend\Stage-Marsa-RDV-Management-backend && mvnw.cmd spring-boot:run"
) else (
  echo mvnw.cmd not found in backend folder.
)

REM Start frontend in new window
if exist "%DEST_DIR%\frontend\package.json" (
  start "RDV Frontend" cmd /k "cd /d %DEST_DIR%\frontend && if not exist node_modules (npm install) && npm run dev"
) else (
  echo frontend package.json not found.
)

:info
echo.
echo Backend will run on port 8081 (if started). Frontend runs on port 5173.
echo Open http://localhost:5173/ in your browser to use the app (frontend).
echo To stop, close the two CMD windows started for backend and frontend.
:end
ENDLOCAL