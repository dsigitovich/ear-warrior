import os
import requests
import json
import sys

# Получаем API-ключ
XAI_API_KEY = os.getenv("XAI_API_KEY")
if not XAI_API_KEY:
    print("Ошибка: XAI_API_KEY не установлен.", file=sys.stderr)
    sys.exit(1)

# Получаем описание тикета
if len(sys.argv) < 2:
    print("Ошибка: Не указано описание тикета.", file=sys.stderr)
    sys.exit(1)
issue_body = sys.argv[1]

# Настройка запроса
url = "https://api.x.ai/v1/completions"  # Проверьте актуальность
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
    "max_tokens": 1000
}

# Отладочный вывод
print("Request URL:", url)
print("Request headers:", headers)
print("Request data:", json.dumps(data, indent=2))

# Выполняем запрос
try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
    print("Response body:", response.text)
    sys.exit(1)

# Извлекаем сгенерированный код
try:
    generated_data = json.loads(response.json().get("choices", [{}])[0].get("text", "{}"))
    if not isinstance(generated_data, dict):
        raise ValueError("Ответ не является словарем JSON")
except json.JSONDecodeError as e:
    print(f"Ошибка: Не удалось разобрать JSON: {e}", file=sys.stderr)
    sys.exit(1)

if not generated_data:
    print("Ошибка: Пустой результат от API.", file=sys.stderr)
    sys.exit(1)

# Сохраняем файлы
for filename, code in generated_data.items():
    with open(filename, "w") as f:
        f.write(code.strip())
    print(f"Сгенерирован файл: {filename}")

print("Все файлы успешно сгенерированы")
