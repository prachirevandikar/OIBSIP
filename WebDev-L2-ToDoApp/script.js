// ================================
// TO-DO WEB APP
// ================================

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const errorMessage = document.getElementById("errorMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter-btn");

const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const saveEdit = document.getElementById("saveEdit");
const closeModal = document.getElementById("closeModal");

// Store tasks
let tasks = JSON.parse(localStorage.getItem("taskFlowTasks")) || [];

// Current filter
let currentFilter = "all";

// Task being edited
let editingTaskId = null;


// ================================
// SAVE TASKS TO LOCAL STORAGE
// ================================

function saveTasks() {
    localStorage.setItem("taskFlowTasks", JSON.stringify(tasks));
}


// ================================
// ADD TASK
// ================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "Please enter a task.";
        taskInput.focus();
        return;
    }

    if (taskText.length > 150) {
        errorMessage.textContent =
            "Task should not be longer than 150 characters.";
        return;
    }

    errorMessage.textContent = "";

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.unshift(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
});


// ================================
// DISPLAY TASKS
// ================================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );
    }

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        if (currentFilter === "all") {

            emptyTitle.textContent = "No tasks yet";

            emptyText.textContent =
                "Add your first task and start organizing your day.";

        } else if (currentFilter === "pending") {

            emptyTitle.textContent = "No pending tasks";

            emptyText.textContent =
                "Great! You have no pending tasks.";

        } else {

            emptyTitle.textContent = "No completed tasks";

            emptyText.textContent =
                "Completed tasks will appear here.";

        }

    } else {

        emptyState.style.display = "none";

        filteredTasks.forEach(task => {

            const taskElement = createTaskElement(task);

            taskList.appendChild(taskElement);

        });
    }

    updateCounters();
}


// ================================
// CREATE TASK ELEMENT
// ================================

function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function () {

        toggleTask(task.id);

    });


    // Task information
    const taskInfo = document.createElement("div");

    taskInfo.className = "task-info";


    const taskText = document.createElement("div");

    taskText.className = "task-text";

    taskText.textContent = task.text;


    const taskTime = document.createElement("div");

    taskTime.className = "task-time";

    taskTime.textContent =
        "Added: " + task.createdAt;


    taskInfo.appendChild(taskText);

    taskInfo.appendChild(taskTime);


    // Action buttons
    const actions = document.createElement("div");

    actions.className = "task-actions";


    // Edit button
    const editButton = document.createElement("button");

    editButton.className =
        "action-btn edit-btn";

    editButton.innerHTML = "✏️";

    editButton.title = "Edit task";

    editButton.addEventListener("click", function () {

        openEditModal(task);

    });


    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.className =
        "action-btn delete-btn";

    deleteButton.innerHTML = "🗑️";

    deleteButton.title = "Delete task";

    deleteButton.addEventListener("click", function () {

        deleteTask(task.id);

    });


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    taskItem.appendChild(checkbox);

    taskItem.appendChild(taskInfo);

    taskItem.appendChild(actions);


    return taskItem;
}


// ================================
// COMPLETE / UNCOMPLETE TASK
// ================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}


// ================================
// OPEN EDIT MODAL
// ================================

function openEditModal(task) {

    editingTaskId = task.id;

    editInput.value = task.text;

    editModal.classList.add("show");

    editInput.focus();

}


// ================================
// CLOSE EDIT MODAL
// ================================

function closeEditModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

    editInput.value = "";

}


// ================================
// SAVE EDITED TASK
// ================================

saveEdit.addEventListener("click", function () {

    const updatedText =
        editInput.value.trim();

    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;
    }

    if (updatedText.length > 150) {

        alert(
            "Task should not be longer than 150 characters."
        );

        return;
    }

    tasks = tasks.map(task => {

        if (task.id === editingTaskId) {

            return {
                ...task,
                text: updatedText
            };

        }

        return task;

    });

    saveTasks();

    closeEditModal();

    renderTasks();

});


// ================================
// CLOSE MODAL
// ================================

closeModal.addEventListener(
    "click",
    closeEditModal
);


// Close modal when clicking outside
editModal.addEventListener(
    "click",
    function (event) {

        if (event.target === editModal) {

            closeEditModal();

        }

    }
);


// Close modal using Escape key
document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeEditModal();

        }

    }
);


// ================================
// FILTER TASKS
// ================================

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");

        currentFilter =
            this.dataset.filter;

        renderTasks();

    });

});


// ================================
// UPDATE COUNTERS
// ================================

function updateCounters() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        total - completed;

    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;
}


// ================================
// INITIAL LOAD
// ================================

renderTasks();