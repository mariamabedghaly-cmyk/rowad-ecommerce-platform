@echo off
title Rowad E-Commerce Platform - Stop All Services
echo ===================================================
echo   Stopping Rowad E-Commerce Services on Ports:
echo   5001, 5002, 5003, 5004, 5005, 5173
echo ===================================================

powershell -Command "$ports = @(5001, 5002, 5003, 5004, 5005, 5173); foreach ($p in $ports) { $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; foreach ($c in $conns) { try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host ('Stopped process ' + $c.OwningProcess + ' on port ' + $p) } catch {} } }"

echo Done! All services stopped.
pause
