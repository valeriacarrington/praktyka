document.addEventListener("DOMContentLoaded", function() {
    loadTeachers();
    loadSchedule();
});

// Додає викладача з перевіркою
function addTeacher() {
    let name = document.getElementById("teacher_name").value.trim();

    if (name.length === 0 || name.length > 30) {
        alert("Ім'я викладача повинно бути від 1 до 30 символів!");
        return;
    }

    fetch('/add_teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          loadTeachers();
      });
}

// Завантажує список викладачів
function loadTeachers() {
    fetch('/teachers')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("teacher_select");
            let list = document.getElementById("teacher_list");
            select.innerHTML = "";
            list.innerHTML = "";

            for (let id in data) {
                let option = document.createElement("option");
                option.value = id;
                option.textContent = data[id].name;
                select.appendChild(option);

                let li = document.createElement("li");
                li.innerHTML = `${data[id].name} <button onclick="editTeacher(${id})">Редагувати</button>`;
                list.appendChild(li);
            }
        });
}

// Редагує ім'я викладача
function editTeacher(id) {
    let newName = prompt("Нове ім'я (до 30 символів):");

    if (!newName || newName.trim().length === 0 || newName.trim().length > 30) {
        alert("Ім'я викладача повинно бути від 1 до 30 символів!");
        return;
    }

    fetch(`/edit_teacher/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          loadTeachers();
      });
}

// Додає пару в розклад з перевірками
function addLesson() {
    let day = document.getElementById("lesson_day").value;
    let time = document.getElementById("lesson_time").value.trim();
    let subject = document.getElementById("lesson_subject").value.trim();
    let teacherId = document.getElementById("teacher_select").value;

    // Перевірка обраного дня тижня
    if (day === "") {
        alert("Оберіть день тижня!");
        return;
    }

    // Перевірка формату часу
    let timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(time)) {
        alert("Введіть правильний час у форматі HH:MM (0-23 години, 0-59 хвилин)!");
        return;
    }

    // Перевірка довжини назви предмета
    if (subject.length === 0 || subject.length > 100) {
        alert("Назва предмета повинна містити від 1 до 100 символів!");
        return;
    }

    fetch('/add_lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            day: day,
            time: time,
            subject: subject,
            teacher_id: parseInt(teacherId)
        })
    }).then(response => response.json())
      .then(data => {
          if (data.error) {
              alert(data.error);
          } else {
              alert("Пара додана!");
              loadSchedule();
          }
      });
}

// Завантажує розклад
function loadSchedule() {
    fetch('/schedule')
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("schedule_table");
            table.innerHTML = "";
            for (let day in data) {
                data[day].forEach(lesson => {
                    let row = document.createElement("tr");
                    row.innerHTML = `<td>${day}</td>
                                     <td>${lesson.time}</td>
                                     <td>${lesson.teacher_id}</td>
                                     <td>${lesson.subject}</td>`;
                    table.appendChild(row);
                });
            }
        });
}
