@echo off
cd /d "%~dp0"
python tools\validate_circular_puzzles.py
echo.
pause
