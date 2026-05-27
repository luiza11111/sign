@echo off
chcp 65001 >nul
cls
setlocal enabledelayedexpansion

echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║     🔍 ДИАГНОСТИКА SIGN LANGUAGE HELPER - ПОЛНАЯ ПРОВЕРКА        ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

set /a passed=0
set /a failed=0

REM ============================================================
echo 📋 ПРОВЕРКА 1/10: Node.js
echo ──────────────────────────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден
    set /a failed=!failed!+1
) else (
    for /f "tokens=*" %%i in ('node --version') do (
        echo ✅ Node.js: %%i
    )
    set /a passed=!passed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 2/10: npm
echo ──────────────────────────────────────────────────────────
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не найден
    set /a failed=!failed!+1
) else (
    for /f "tokens=*" %%i in ('npm --version') do (
        echo ✅ npm: %%i
    )
    set /a passed=!passed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 3/10: Frontend .env
echo ──────────────────────────────────────────────────────────
if not exist ".env" (
    echo ❌ .env файл не найден
    set /a failed=!failed!+1
) else (
    echo ✅ .env файл найден
    for /f "usebackq tokens=2 delims==" %%i in (`.env`) do (
        if "%%i"=="localhost:3001" (
            echo ✅ VITE_API_URL = %%i (ПРАВИЛЬНО)
        ) else (
            echo ⚠️  VITE_API_URL = %%i (может быть неправильно)
        )
    )
    set /a passed=!passed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 4/10: Backend .env
echo ──────────────────────────────────────────────────────────
if not exist "server\.env" (
    echo ❌ server\.env файл не найден
    set /a failed=!failed!+1
) else (
    echo ✅ Backend .env найден
    for /f "usebackq tokens=2 delims==" %%i in (`server\.env`) do (
        echo    - %%i
    )
    set /a passed=!passed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 5/10: Frontend node_modules
echo ──────────────────────────────────────────────────────────
if exist "node_modules\package.json" (
    echo ✅ Frontend зависимости установлены
    set /a passed=!passed!+1
) else (
    echo ⚠️  Frontend node_modules может отсутствовать
    echo    Запустите: npm install
    set /a failed=!failed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 6/10: Backend node_modules
echo ──────────────────────────────────────────────────────────
if exist "server\node_modules\package.json" (
    echo ✅ Backend зависимости установлены
    set /a passed=!passed!+1
) else (
    echo ⚠️  Backend node_modules может отсутствовать
    echo    Запустите: cd server && npm install
    set /a failed=!failed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 7/10: Vue файлы
echo ──────────────────────────────────────────────────────────
if exist "src\views\Login.vue" (
    echo ✅ Frontend файлы найдены
    set /a passed=!passed!+1
) else (
    echo ❌ Frontend файлы не найдены
    set /a failed=!failed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 8/10: Backend файлы
echo ──────────────────────────────────────────────────────────
if exist "server\index.js" (
    echo ✅ Backend файлы найдены
    set /a passed=!passed!+1
) else (
    echo ❌ Backend файлы не найдены
    set /a failed=!failed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 9/10: Скрипты запуска
echo ──────────────────────────────────────────────────────────
if exist "START_ALL.bat" (
    echo ✅ START_ALL.bat найден
    set /a passed=!passed!+1
) else (
    echo ❌ START_ALL.bat не найден
    set /a failed=!failed!+1
)
echo.

REM ============================================================
echo 📋 ПРОВЕРКА 10/10: Документация
echo ──────────────────────────────────────────────────────────
if exist "ПОЛНОЕ_РУКОВОДСТВО.md" (
    echo ✅ Документация готова
    set /a passed=!passed!+1
) else (
    echo ⚠️  Документация может быть неполной
    set /a failed=!failed!+1
)
echo.

REM ============================================================
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                      📊 ИТОГИ ДИАГНОСТИКИ                        ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

set /a total=!passed!+!failed!
echo ✅ Все OK:     %passed%
echo ❌ Проблем:    %failed%
echo 📊 Итого:      %total%/10
echo.

if %failed% equ 0 (
    echo ╔═══════════════════════════════════════════════════════════════════╗
    echo ║          🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! СИСТЕМА ГОТОВА!               ║
    echo ╚═══════════════════════════════════════════════════════════════════╝
    echo.
    echo 🚀 Следующий шаг:
    echo    Запустите: START_ALL.bat
    echo.
) else (
    echo ╔═══════════════════════════════════════════════════════════════════╗
    echo ║          ⚠️  ЕСТЬ ПРОБЛЕМЫ! СМ. ВЫШЕ                              ║
    echo ╚═══════════════════════════════════════════════════════════════════╝
    echo.
    echo 🔧 Рекомендации:
    echo    1. Проверьте установку Node.js
    echo    2. Запустите: npm install && cd server && npm install
    echo    3. Проверьте PostgreSQL
    echo    4. Проверьте .env файлы
    echo.
)

pause
