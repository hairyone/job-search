@echo off
REM Automated backup script for Job Application Tracker (Windows)
REM Creates compressed SQL backups.

SETLOCAL EnableDelayedExpansion

SET BACKUP_DIR=%USERPROFILE%\Backups\job-tracker
SET CONTAINER_NAME=job-tracker-db
SET DB_USER=postgres
SET DB_NAME=job_tracker

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
SET DATE=%datetime:~0,8%-%datetime:~8,6%
SET BACKUP_FILE=%BACKUP_DIR%\backup-%DATE%.sql.gz

echo.
echo Job Tracker Backup
echo.

REM Check if container is running
docker ps --format "{{.Names}}" | findstr /X "%CONTAINER_NAME%" >nul 2>&1
if errorlevel 1 (
    echo Database container is not running. Starting stack...
    docker compose up -d
    REM Wait for postgres to be healthy
    :WAIT_LOOP
    docker inspect --format="{{.State.Health.Status}}" %CONTAINER_NAME% 2>nul | findstr /C:"healthy" >nul 2>&1
    if errorlevel 1 (
        timeout /t 2 /nobreak >nul
        goto WAIT_LOOP
    )
)

echo Creating SQL backup...
docker exec %CONTAINER_NAME% pg_dump -U %DB_USER% %DB_NAME% | gzip > "%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo Backup created: %BACKUP_FILE%
    for /f %%i in ('docker exec %CONTAINER_NAME% psql -U %DB_USER% %DB_NAME% -t -c "SELECT COUNT(*) FROM jobs;"') do set RECORD_COUNT=%%i
    echo Jobs: !RECORD_COUNT!
    echo.
    echo To restore:
    echo   gunzip -c "%BACKUP_FILE%" ^| docker exec -i %CONTAINER_NAME% psql -U %DB_USER% %DB_NAME%
    echo.
) else (
    echo Backup failed.
    exit /b 1
)

ENDLOCAL
