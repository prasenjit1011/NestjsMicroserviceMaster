@echo off
echo Stopping and cleaning up Spring Boot application...
echo.

echo Stopping Docker containers...
docker-compose down

echo Removing Docker volumes (this will delete database data)...
docker-compose down -v

echo Cleanup completed!
pause
