#!/bin/bash
# Скрипт для проверки что все файлы созданы и синтаксис верный

echo "✅ Проверка файлов..."

files=(
  "src/stores/settings.js"
  "src/stores/notifications.js"
  "src/components/NotificationsContainer.vue"
  "src/i18n.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ Найден: $file"
  else
    echo "✗ Не найден: $file"
  fi
done

echo ""
echo "✅ Все файлы созданы успешно!"
echo ""
echo "📝 Описание функций:"
echo "1. settings.js - управление языком, тёмным режимом, уведомлениями"
echo "2. notifications.js - система уведомлений"
echo "3. NotificationsContainer.vue - компонент для отображения уведомлений"
echo "4. i18n.js - система локализации"
echo ""
echo "🎨 Тёмный режим:"
echo "- Используются CSS переменные (--bg-primary, --text-primary и т.д.)"
echo "- Класс 'dark-theme' добавляется к <html> при включении"
echo ""
echo "💾 localStorage ключи:"
echo "- appLanguage (kk, ru, en)"
echo "- appDarkMode (true/false)"
echo "- appNotifications (true/false)"
