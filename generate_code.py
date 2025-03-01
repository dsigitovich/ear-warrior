python
import os
import requests
import json
import sys

# Получаем API-ключ из переменной окружения
XAI_API_KEY = os.getenv("XAI_API_KEY")
if not XAI_API_KEY:
    print("Ошибка: XAI_API_KEY не установлен.", file=sys.stderr)
    sys.exit(1)

# Получаем описание тикета из аргумента командной строки
if len(sys.argv) < 2:
    print("Ошибка: Не указано описание тикета.", file=sys.stderr)
    sys.exit(1)
issue_body = sys.argv[1]

# Настройка запроса к API xAI с просьбой вернуть код в формате JSON
url = "https://api.x.ai/v1/completions"  # Проверьте актуальный endpoint
headers = {
    "Authorization": f"Bearer {XAI_API_KEY}",
    "Content-Type": "application/json"
}
data = {
    "prompt": (
        f"Generate code to solve the following problem: {issue_body}. "
        "Return the result as a JSON object where each key is a filename (e.g., 'main.py', 'utils.js') "
        "and each value is the corresponding code content. Example: "
        "{'main.py': 'print(\"Hello\")', 'helper.py': 'def add(a, b): return a + b'}"
    ),
    "max_tokens": 1000  # Увеличиваем лимит для нескольких файлов
}

# Выполняем запрос к API
response = requests.post(url, headers=headers, json=data)
response.raise_for_status()

# Извлекаем сгенерированный код в формате JSON
try:
    generated_data = json.loads(response.json().get("choices", [{}])[0].get("text", "{}"))
    if not isinstance(generated_data, dict):
        raise ValueError("Ответ не является словарем JSON")
except json.JSONDecodeError as e:
    print(f"Ошибка: Не удалось разобрать JSON из ответа API: {e}", file=sys.stderr)
    sys.exit(1)
except ValueError as e:
    print(f"Ошибка: {e}", file=sys.stderr)
    sys.exit(1)

if not generated_data:
    print("Ошибка: Пустой результат от API.", file=sys.stderr)
    sys.exit(1)

# Сохраняем код в соответствующие файлы
for filename, code in generated_data.items():
    with open(filename, "w") as f:
        f.write(code.strip())
    print(f"Сгенерирован файл: {filename}")

print("Все файлы успешно сгенерированы")
