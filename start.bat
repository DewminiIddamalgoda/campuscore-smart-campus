@echo off
echo Starting Smart Campus Project...
echo.

echo Step 1: Starting Backend (Spring Boot API)
cd smart-campus-api
echo Building and starting Spring Boot application...
start "Backend API" cmd /k "mvnw spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak

echo.
echo Step 2: Starting Frontend (React Client)
cd ..\smart-campus-client
echo Installing dependencies and starting React development server...
start "Frontend Client" cmd /k "npm start"

echo.
echo Both services are starting...
echo.
echo Backend will be available at: http://localhost:8080/api
echo Frontend will be available at: http://localhost:5173
echo.
echo Please wait a few moments for both services to fully start.
echo.

pause
