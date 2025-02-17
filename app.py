from flask import Flask, render_template, request, jsonify
from collections import defaultdict

app = Flask(__name__)

# "База даних" у пам’яті
teachers = {}  # {teacher_id: {"name": "Ім'я"}}
schedule = defaultdict(list)  # {day: [{"time": "10:00", "teacher_id": 1, "subject": "Math"}]}

@app.route('/')
def index():
    return render_template('index.html')

# Додати викладача
@app.route('/add_teacher', methods=['POST'])
def add_teacher():
    data = request.json
    teacher_id = len(teachers) + 1
    teachers[teacher_id] = {"name": data["name"]}
    return jsonify({"message": "Викладач доданий", "teacher_id": teacher_id, "teachers": teachers})

# Редагувати ім'я викладача
@app.route('/edit_teacher/<int:teacher_id>', methods=['POST'])
def edit_teacher(teacher_id):
    data = request.json
    if teacher_id in teachers:
        teachers[teacher_id]["name"] = data["name"]
        return jsonify({"message": "Ім'я оновлено", "teachers": teachers})
    return jsonify({"error": "Викладач не знайдений"}), 404

# Отримати список викладачів
@app.route('/teachers', methods=['GET'])
def get_teachers():
    return jsonify(teachers)

# Додати пару в розклад
@app.route('/add_lesson', methods=['POST'])
def add_lesson():
    data = request.json
    day, time, teacher_id, subject = data["day"], data["time"], data["teacher_id"], data["subject"]

    # Перевірка конфлікту
    for lesson in schedule[day]:
        if lesson["time"] == time and lesson["teacher_id"] == teacher_id:
            return jsonify({"error": "Конфлікт: викладач зайнятий у цей час"}), 400

    schedule[day].append({"time": time, "teacher_id": teacher_id, "subject": subject})
    return jsonify({"message": "Пара додана", "schedule": schedule})

# Отримати розклад
@app.route('/schedule', methods=['GET'])
def get_schedule():
    return jsonify(schedule)

if __name__ == '__main__':
    app.run(debug=True)
