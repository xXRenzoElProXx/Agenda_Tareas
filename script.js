document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    updateButtonStates();
});
document.getElementById('add-task-btn').addEventListener('click', function () {
    addTask();
    updateButtonStates();
});
document.getElementById('filter-task').addEventListener('input', filterTasks);
document.getElementById('toggle-all-completed-btn').addEventListener('click', function () {
    toggleAllTasksCompleted();
    updateButtonStates();
});

let taskIdCounter = 0;

function addTask() {
    const taskInput = document.getElementById('new-task');
    const prioritySelect = document.getElementById('task-priority');
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText === '') {
        swal("Error!", "Por favor, ingrese una tarea.", "error");

        return;
    }

    const taskItem = createTaskItem(taskText, priority);
    document.getElementById('task-list').appendChild(taskItem);

    saveTaskToLocalStorage(taskText, priority);
    taskInput.value = '';
    updateTaskCounter();
    updateButtonStates();
}

function createTaskItem(taskText, priority, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${priority}-priority` + (completed ? ' completed' : '');

    const checkboxId = `checkbox-${taskIdCounter++}`;

    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" id="${checkboxId}" ${completed ? 'checked' : ''}>
        <label for="${checkboxId}" style="cursor: pointer">
            <span>${taskText}</span>
        </label>
        <button onclick="removeTask(this)">Eliminar</button>
    `;

    taskItem.querySelector('.task-checkbox').addEventListener('change', function () {
        taskItem.classList.toggle('completed', this.checked);
        updateLocalStorage();
        updateTaskCounter();
    });

    return taskItem;
}

function removeTask(button) {
    const taskItem = button.parentElement;
    taskItem.remove();
    updateLocalStorage();
    updateTaskCounter();
    updateButtonStates();
}

function saveTaskToLocalStorage(taskText, priority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, priority: priority, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskItem(task.text, task.priority, task.completed);
        document.getElementById('task-list').appendChild(taskItem);
    });
    updateTaskCounter();
    updateButtonStates();
}

function updateLocalStorage() {
    let tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('span').textContent,
            priority: item.className.split(' ').find(cls => cls.endsWith('-priority')).replace('-priority', ''),
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCounter() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const remainingTasks = totalTasks - completedTasks;

    document.getElementById('task-counter').textContent = `Tareas Completadas: ${completedTasks} | Tareas Pendientes: ${remainingTasks}`;
}

function filterTasks() {
    const filterText = document.getElementById('filter-task').value.toLowerCase();
    document.querySelectorAll('.task-item').forEach(item => {
        const taskText = item.querySelector('span').textContent.toLowerCase();
        item.style.display = taskText.includes(filterText) ? '' : 'none';
    });
}

function toggleAllTasksCompleted() {
    const toggleButton = document.getElementById('toggle-all-completed-btn');
    const isMarking = toggleButton.textContent === 'Marcar todas';

    document.querySelectorAll('.task-item').forEach(item => {
        if (isMarking) {
            item.classList.add('completed');
            item.querySelector('.task-checkbox').checked = true;
        } else {
            item.classList.remove('completed');
            item.querySelector('.task-checkbox').checked = false;
        }
    });

    toggleButton.textContent = isMarking ? 'Desmarcar todas' : 'Marcar todas';
    updateLocalStorage();
    updateTaskCounter();
}

function updateButtonStates() {
    const taskList = document.getElementById('task-list');
    const noTasks = taskList.children.length === 0;
    document.getElementById('toggle-all-completed-btn').disabled = noTasks;
}
