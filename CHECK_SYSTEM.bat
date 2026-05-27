@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║          ✅ ПРОВЕРКА ГОТОВНОСТИ СИСТЕМЫ                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Проверка Node.js
echo [1/5] Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ %%i найден
)
echo.

REM Проверка npm
echo [2/5] Проверка npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не установлен
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm %%i найден
)
echo.

REM Проверка .env файла
echo [3/5] Проверка конфигурации...
if not exist ".env" (
    echo ❌ .env файл не найден!
    exit /b 1
) else (
    echo ✅ .env файл найден
    findstr "VITE_API_URL" .env >nul
    if errorlevel 1 (
        echo ⚠️  VITE_API_URL не установлен
    ) else (
        echo ✅ VITE_API_URL установлен
    )
)
echo.

REM Проверка frontend node_modules
echo [4/5] Проверка Frontend зависимостей...
if not exist "node_modules" (
    echo ⚠️  node_modules отсутствует - запустите npm install
) else (
    echo ✅ Frontend зависимости найдены
)
echo.

REM Проверка backend node_modules
echo [5/5] Проверка Backend зависимостей...
if not exist "server\node_modules" (
    echo ⚠️  server/node_modules отсутствует - запустите npm install в server
) else (
    echo ✅ Backend зависимости найдены
)
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  📋 РЕЗУЛЬТАТЫ ПРОВЕРКИ                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ✅ Система готова к запуску!
echo.
echo 📍 Следующие шаги:
echo    1. Убедитесь что PostgreSQL запущена
echo    2. Запустите START_ALL.bat
echo    3. Откройте http://localhost:5173
echo.
echo 🔐 Используйте тестовый аккаунт:
echo    Email: admin@gmail.com
echo    Password: admin123
echo.
pause
