@echo off
REM Docker run script for To-Do List with persistent storage
echo Starting To-Do List with persistent storage...

REM Create a data directory if it doesn't exist
if not exist "data" mkdir data

REM Copy tasks.json to data directory if it doesn't exist there
if not exist "data\tasks.json" (
    if exist "tasks.json" (
        copy "tasks.json" "data\tasks.json"
        echo Copied tasks.json to data directory for persistence
    )
)

REM Run Docker with volume mount for persistence
docker run -it -v "%CD%\data:/app/data" -e TASK_FILE="/app/data/tasks.json" todo-list-v3

echo.
echo Tasks are saved in the 'data' directory and will persist between runs.
pause
