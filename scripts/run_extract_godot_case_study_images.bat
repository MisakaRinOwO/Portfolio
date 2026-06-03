@echo off
set PYTHON_EXE=C:\Users\37496\AppData\Local\Microsoft\WindowsApps\python3.12.exe
set SCRIPT=%~dp0extract_godot_case_study_images.py

echo Running: %PYTHON_EXE% "%SCRIPT%"
"%PYTHON_EXE%" "%SCRIPT%"

echo.
echo Finished. Press any key to close.
pause >nul
