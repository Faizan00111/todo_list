document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "" || isDuplicate(taskText)) return;
    
    let taskList = document.getElementById("taskList");
    let li = createTaskElement(taskText, false);
    taskList.appendChild(li);
    saveTasks();
    taskInput.value = "";
}

function isDuplicate(taskText) {
    return Array.from(document.querySelectorAll("#taskList span")).some(span => span.textContent === taskText);
}

function createTaskElement(text, completed) {
    let li = document.createElement("li");
    li.innerHTML = `
        <input type="checkbox" class="mr-2" ${completed ? "checked" : ""} onchange="toggleTask(this)">
        <span class="flex-1 ${completed ? 'line-through' : ''}" ondblclick="editTask(this)">${text}</span>
        <button onclick="removeTask(this)">✖</button>
    `;
    return li;
}

function toggleTask(checkbox) {
    let task = checkbox.nextElementSibling;
    task.classList.toggle("line-through");
    saveTasks();
}

function editTask(span) {
    let newText = prompt("Edit task:", span.textContent);
    if (newText !== null && !isDuplicate(newText.trim())) {
        span.textContent = newText.trim();
        saveTasks();
    }
}

function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.children[1].textContent,
            completed: li.children[0].checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    tasks.forEach(task => {
        if (!isDuplicate(task.text)) {
            let li = createTaskElement(task.text, task.completed);
            taskList.appendChild(li);
        }
    });
}

function clearTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
}