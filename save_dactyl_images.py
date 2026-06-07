#!/usr/bin/env python3
"""
Скрипт для сохранения изображений дактильных букв казахского алфавита
Убедитесь, что изображения скопированы в буфер обмена перед запуском
"""

import os
import sys
from PIL import Image
from PIL import ImageGrab

# Путь для сохранения
output_dir = r"C:\Users\zhlui\Documents\GitHub\sign\public\images\dactyl"

# Создать папку если не существует
os.makedirs(output_dir, exist_ok=True)

# Информация о буквах в порядке
letters_info = [
    ('a', 'А'),
    ('ae', 'Ә'),
    ('b', 'Б'),
    ('g', 'Г'),
    ('gh', 'Ғ'),
    ('d', 'Д'),
    ('e', 'Е'),
    ('zh', 'Ж'),
    ('z', 'З'),
    ('i', 'И'),
    ('k', 'К'),
    ('q', 'Қ'),
]

print("🖼️  Инструкция по сохранению дактильных букв:")
print("-" * 60)
print("1. Откройте VS Code")
print("2. Откройте эту папку в файловом менеджере: public\\images\\dactyl")
print("3. Скопируйте каждое изображение букв в этот порядок:")
print()

for i, (filename, letter) in enumerate(letters_info, 1):
    print(f"{i}. Откройте изображение буквы '{letter}' и сохраните как: {filename}.jpg")

print()
print("ИЛИ скопируйте изображения и запустите этот скрипт:")
print("python save_dactyl_images.py")
