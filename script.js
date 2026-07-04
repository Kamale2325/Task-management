// ===============================
// TASK MANAGEMENT SYSTEM
// ===============================

// --------- Beep Sound ----------
function playBeep() {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 800;

    oscillator.start();

    setTimeout(() => {
        oscillator.stop();
    }, 600);

}

// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save Tasks
function saveLocal() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Dashboard Counter
function updateDashboard() {

    let total = document.getElementById("totalTasks");

    if (total) {
        total.innerHTML = tasks.length;
    }

}

// ===============================
// ADD TASK
// ===============================

function saveTask() {

    let task = document.getElementById("task").value.trim();
    let priority = document.getElementById("priority").value;
    let date = document.getElementById("date").value;
    let alarm = document.getElementById("alarm").value;
    let notes = document.getElementById("notes").value;

    if (task == "") {

        alert("Please Enter Task");

        return;

    }

    tasks.push({

        task: task,
        priority: priority,
        date: date,
        alarm: alarm,
        notes: notes,
        completed: false,
        notified: false

    });

    saveLocal();

    alert("Task Added Successfully!");

    window.location = "tasks.html";

}

// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks() {

    let table = document.getElementById("taskTable");

    if (!table) return;

    table.innerHTML = "";

    tasks.forEach((item, index) => {

        table.innerHTML += `

<tr>

<td>${item.task}</td>

<td>${item.priority}</td>

<td>${item.date}</td>

<td>${item.alarm}</td>

<td>
<button class="status-btn"
style="background:${item.completed ? '#16a34a' : '#f59e0b'};">

${item.completed ? "Completed" : "Pending"}

</button>

</td>

<td>

<button class="delete-btn"

onclick="deleteTask(${index})">

Delete

</button>

</td>

</tr>

`;

    });

}

// ===============================
// DELETE TASK
// ===============================

function deleteTask(index) {

    tasks.splice(index, 1);

    saveLocal();

    displayTasks();

    updateDashboard();

}

// ===============================
// COMPLETE TASK
// ===============================

function completeTask(index) {

    tasks[index].completed = !tasks[index].completed;

    saveLocal();

    displayTasks();

}

// ===============================
// ALARM CHECKER
// ===============================

setInterval(function () {

    let now = new Date();

    let today = now.toISOString().split("T")[0];

    let currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (t) {

        if (
    t.date === today &&
    t.alarm === currentTime &&
    !t.notified
) {

    playBeep();

    alert(
        "🔔 Reminder!\n\n" +
        "Task : " + t.task +
        "\n\nTask Completed Successfully!"
    );

    // Alarm has been shown
    t.notified = true;

    // Automatically change status
    t.completed = true;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();

}

    });

}, 1000);


// ===============================

updateDashboard();

displayTasks();

