const clock = document.getElementById('clock');
const dateText = document.getElementById('date');
const greeting = document.getElementById('greeting');
const usernameInput = document.getElementById('username');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const timerDisplay = document.getElementById('timer');
const themeBtn = document.getElementById('theme-btn');

let tasks = JSON.parse(
    localStorage.getItem('tasks')
) || [];

let timer;
let timeLeft = 1500;

function updateClock() {

    const now = new Date();

    clock.innerText =
        now.toLocaleTimeString();

    dateText.innerText =
        now.toDateString();

    const hour = now.getHours();

    let text = 'Good Evening';

    if (hour < 12) {
        text = 'Good Morning';
    } else if (hour < 18) {
        text = 'Good Afternoon';
    }

    const savedName =
        localStorage.getItem('username');

    if (savedName) {
        greeting.innerText =
            `${text}, ${savedName}`;
    } else {
        greeting.innerText = text;
    }
}

setInterval(updateClock, 1000);

function saveName() {

    localStorage.setItem(
        'username',
        usernameInput.value
    );

    updateClock();
}

function renderTasks() {

    taskList.innerHTML = '';

    tasks.forEach((task, index) => {

        const li = document.createElement('li');

        if (task.done) {
            li.classList.add('completed');
        }

        li.innerHTML = `
      <span onclick="toggleTask(${index})">
        ${task.text}
      </span>

      <div>

        <button onclick="editTask(${index})">
          Edit
        </button>

        <button onclick="deleteTask(${index})">
          Delete
        </button>

      </div>
    `;

        taskList.appendChild(li);
    });

    localStorage.setItem(
        'tasks',
        JSON.stringify(tasks)
    );
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === '') {
        return;
    }

    const duplicate = tasks.find(
        task => task.text === text
    );

    if (duplicate) {
        alert('Task already exists!');
        return;
    }

    tasks.push({
        text: text,
        done: false
    });

    taskInput.value = '';

    renderTasks();
}

function toggleTask(index) {

    tasks[index].done = !tasks[index].done;

    renderTasks();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    renderTasks();
}

function editTask(index) {

    const newTask = prompt(
        'Edit task',
        tasks[index].text
    );

    if (newTask) {

        tasks[index].text = newTask;

        renderTasks();
    }
}

function sortTasks() {

    const value =
        document.getElementById(
            'sort-select'
        ).value;

    if (value === 'done') {

        tasks.sort(
            (a, b) => b.done - a.done
        );
    }

    renderTasks();
}

function updateTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    timerDisplay.innerText =
        `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        if (timeLeft > 0) {

            timeLeft--;

            updateTimer();

        }

    }, 1000);
}

function stopTimer() {

    clearInterval(timer);
}

function resetTimer() {

    clearInterval(timer);

    timeLeft = 1500;

    updateTimer();
}

function changeTimer() {

    const custom =
        document.getElementById(
            'custom-time'
        ).value;

    if (custom > 0) {

        timeLeft = custom * 60;

        updateTimer();
    }
}

themeBtn.addEventListener(
    'click',
    () => {

        document.body.classList.toggle(
            'dark-mode'
        );
    }
);

updateClock();

renderTasks();

updateTimer();