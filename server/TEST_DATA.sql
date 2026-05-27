-- ===============================================================
-- 🧪 ТЕСТОВЫЕ ДАННЫЕ ДЛЯ SIGN LANGUAGE HELPER
-- ===============================================================

-- Пароли уже захеширован bcrypt (admin123)
-- Hash: $2b$10$YOUR_HASH_HERE

-- Убедитесь что эти пользователи существуют:

-- 1. АДМИН (уже создается автоматически)
SELECT * FROM users WHERE email = 'admin@gmail.com';

-- 2. Создание тестового пользователя (если нужно)
INSERT INTO users (name, email, password_hash, role, created_at)
VALUES (
  'Тест Пользователь',
  'test@gmail.com',
  '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5EQaIx6yfnpm6', -- пароль: 123456
  'user',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 3. Проверка всех пользователей
SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC;

-- 4. Проверка словаря
SELECT COUNT(*) as dictionary_count FROM dictionary;
SELECT * FROM dictionary LIMIT 5;

-- ===============================================================
-- ВАЖНО: Если вы видите эту ошибку при запуске:
-- "duplicate key value violates unique constraint"
-- Это нормально - означает что данные уже в БД
-- ===============================================================
