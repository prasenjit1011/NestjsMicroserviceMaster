@echo off
echo Building Spring Boot Login Dashboard Application...
echo.

echo Step 1: Cleaning and packaging the application...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Choose how to run the application:
echo 1. Run with Docker
echo 2. Run locally with Maven
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo Step 2: Building Docker image and starting application...
    docker-compose up --build -d
    if %errorlevel% neq 0 (
        echo Docker deployment failed!
        pause
        exit /b 1
    )
    echo.
    echo Application deployed successfully with Docker!
    echo Access the application at: http://localhost:8080
) else if "%choice%"=="2" (
    echo Step 2: Starting application with Maven...
    echo Application starting at: http://localhost:8080
    echo.
    mvn spring-boot:run
) else (
    echo Invalid choice. Exiting...
    pause
    exit /b 1
)

echo.
echo Default users:
echo - Admin: admin / admin123
echo - Demo user 1: john_doe / password123
echo - Demo user 2: jane_smith / password123
echo.
pause
