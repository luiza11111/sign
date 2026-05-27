@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        🚀 SIGN LANGUAGE HELPER - ПОЛНАЯ СИСТЕМА ЗАПУСКА        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Проверка Node.js
echo ⏳ Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен!
    echo Скачайте с https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js найден

REM Проверка npm зависимостей для backend
echo.
echo ⏳ Установка зависимостей Backend...
cd /d "%~dp0server"
if not exist "node_modules" (
    echo 📦 Первый запуск - установка npm пакетов...
    call npm install
)
echo ✅ Backend зависимости готовы

REM Проверка npm зависимостей для frontend
echo.
echo ⏳ Установка зависимостей Frontend...
cd /d "%~dp0"
if not exist "node_modules" (
    echo 📦 Первый запуск - установка npm пакетов...
    call npm install
)
echo ✅ Frontend зависимости готовы

REM Запуск обоих серверов
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    📍 ЗАПУСК СЕРВЕРОВ                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Backend в новом окне
echo 🔵 Запуск Backend на порту 3001...
start "Backend Server" cmd /k "cd /d "%~dp0server" && npm start"

REM Ждём немного пока backend стартует
timeout /t 3 /nobreak

REM Frontend в новом окне
echo 🟡 Запуск Frontend на порту 5173...
start "Frontend Server" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   ✅ ВСЕ СЕРВЕРЫ ЗАПУЩЕНЫ!                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend:  http://localhost:3001
echo.
echo 🔐 Тестовый аккаунт:
echo    Email:    admin@gmail.com
echo    Пароль:   admin123
echo.
echo ⚙️  Если видите ошибки, проверьте:
echo    ✓ PostgreSQL запущена (порт 5432)
echo    ✓ .env файл существует и корректен
echo    ✓ Порты 3001 и 5173 свободны
echo.
pause
