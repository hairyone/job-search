@echo off
REM Automated backup script for Job Application Tracker (Windows)
REM Creates compressed SQL backups

SETLOCAL EnableDelayedExpansion

REM Configuration
SET BACKUP_DIR=%USERPROFILE%\Backups\job-tracker
SET CONTAINER_NAME=job-tracker-db
SET DB_USER=postgres
SET DB_NAME=job_tracker

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generate filename with timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
SET DATE=%datetime:~0,8%-%datetime:~8,6%
SET BACKUP_FILE=%BACKUP_DIR%\backup-%DATE%.sql.gz

echo.
echo ========================================
echo   Job Tracker Backup Script
echo ========================================
echo.

REM Check if Docker container is running
docker ps | findstr /C:"%CONTAINER_NAME%" >nul 2>&1
if errorlevel 1 (
    echo Warning: Database container is not running!
    echo Starting container...
    docker-compose up -d
    timeout /t 3 /nobreak >nul
)

REM Create backup
echo Creating SQL backup...
docker exec %CONTAINER_NAME% pg_dump -U %DB_USER% %DB_NAME% | gzip > "%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ✓ Backup created successfully!
    echo   File: %BACKUP_FILE%
    
    REM Count records
    for /f %%i in ('docker exec %CONTAINER_NAME% psql -U %DB_USER% %DB_NAME% -t -c "SELECT COUNT(*) FROM jobs;"') do set RECORD_COUNT=%%i
    echo   Jobs: !RECORD_COUNT!
    
    echo.
    echo Recent backups:
    dir /O-D /B "%BACKUP_DIR%\backup-*.sql.gz" 2>nul | findstr /N "^" | findstr /R "^[1-5]:"
    
    echo.
    echo To restore this backup:
    echo   gunzip -c "%BACKUP_FILE%" ^| docker exec -i %CONTAINER_NAME% psql -U %DB_USER% %DB_NAME%
    echo.
    echo ✓ Backup complete!
) else (
    echo.
    echo ✗ Backup failed!
    exit /b 1
)

ENDLOCAL
