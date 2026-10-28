@echo off
title Rowad E-Commerce Platform - Service Launcher
echo ===================================================
echo   Starting Rowad E-Commerce Microservices & UI
echo ===================================================

cd /d "%~dp0"

echo [1/6] Launching Auth & User Service (Port 5001)...
start "Auth Service (Port 5001)" cmd /k "cd backend\auth-user-service && node server.js"

echo [2/6] Launching Product & Search Service (Port 5002)...
start "Product Service (Port 5002)" cmd /k "cd backend\product-search-service && .\.venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 5002"

echo [3/6] Launching Payment Service (Port 5003)...
start "Payment Service (Port 5003)" cmd /k "cd backend\payment-service && dotnet run --no-build"

echo [4/6] Launching Cart Service (Port 5004)...
start "Cart Service (Port 5004)" cmd /k "cd backend\cart-service && node server.js"

echo [5/6] Launching Order Service (Port 5005)...
start "Order Service (Port 5005)" cmd /k "cd backend\order-service && node server.js"

echo [6/6] Launching Storefront UI (Port 5173)...
start "Frontend UI (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo All services launched!
echo Access the storefront at: http://localhost:5173
echo ===================================================
timeout /t 5
