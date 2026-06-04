@echo off
REM Maps a temporary drive letter to avoid issues with long/quoted OneDrive paths,
REM then starts the Spring Boot backend via the included Maven wrapper.
setlocal
set SCRIPT_DIR=%~dp0
set TARGET=%SCRIPT_DIR%backend\Stage-Marsa-RDV-Management-backend
echo Mapping X: to %TARGET%
subst X: "%TARGET%"
if ERRORLEVEL 1 (
  echo Failed to create drive mapping, trying to start without mapping...
  pushd "%TARGET%"
  if exist mvnw.cmd (
    mvnw.cmd spring-boot:run
  ) else (
    echo mvnw.cmd not found in %TARGET%
  )
  popd
  goto :end
)
pushd X:\
if exist mvnw.cmd (
  .\mvnw.cmd spring-boot:run
) else (
  echo mvnw.cmd not found on mapped drive X:
)
popd
REM remove mapping after the server exits
:cleanup
subst X: /d >nul 2>&1
:end
endlocal