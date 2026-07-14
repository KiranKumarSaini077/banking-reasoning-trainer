@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { (($_.Name -eq 'python.exe' -or $_.Name -eq 'pythonw.exe') -and $_.CommandLine -like '*start_server.py*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>nul

where pythonw >nul 2>nul
if not errorlevel 1 (
    start "" pythonw "%~dp0tools\start_server.py"
    exit /b 0
)

where py >nul 2>nul
if not errorlevel 1 (
    start "" /min py -3 "%~dp0tools\start_server.py"
    exit /b 0
)

where python >nul 2>nul
if not errorlevel 1 (
    start "" /min python "%~dp0tools\start_server.py"
    exit /b 0
)
