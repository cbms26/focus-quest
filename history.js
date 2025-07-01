document.addEventListener("DOMContentLoaded", function () {
  const historyList = document.getElementById("history-list");

  function loadTasks() {
    // Clear the current list
    historyList.innerHTML = "";

    // Get tasks from localStorage or use empty array if none exist
    let tasks = [];
    const savedTasks = localStorage.getItem("pomodoroTasks");
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }

    // Show message if no tasks exist
    if (tasks.length === 0) {
      historyList.innerHTML =
        '<p class="no-history">Your Quest Log is empty. Go complete some missions!</p>';
      return;
    }

    // Sort tasks by ID (most recent first)
    tasks.sort(function (taskA, taskB) {
      return taskB.id - taskA.id;
    });

    // Create and add task elements to the list
    tasks.forEach(function (task) {
      const taskElement = document.createElement("div");
      taskElement.classList.add("nes-container", "is-dark", "task-item");

      // Create HTML structure for the task
      taskElement.innerHTML =
        '<div class="task-info">' +
        '    <p class="task-title">' +
        task.title +
        "</p>" +
        '    <p class="task-date">' +
        task.date +
        "</p>" +
        "</div>" +
        '<button type="button" class="nes-btn is-error delete-btn" data-id="' +
        task.id +
        '">' +
        '    <i class="nes-icon close is-small"></i>' +
        "</button>";

      historyList.appendChild(taskElement);
    });
  }

  function deleteTask(taskId) {
    // Get current tasks from localStorage
    let tasks = [];
    const savedTasks = localStorage.getItem("pomodoroTasks");
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }

    // Filter out the task to delete
    tasks = tasks.filter(function (task) {
      return task.id !== taskId;
    });

    // Save updated tasks and refresh display
    localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
    loadTasks();
  }

  // Handle clicks on delete buttons
  historyList.addEventListener("click", function (event) {
    // Find closest delete button to the clicked element
    const deleteButton = event.target.closest(".delete-btn");

    if (deleteButton) {
      // Get task ID and convert to number
      const taskId = Number(deleteButton.getAttribute("data-id"));

      // Confirm before deleting
      const userConfirmed = confirm(
        "Are you sure you want to remove this quest from your log?"
      );
      if (userConfirmed) {
        deleteTask(taskId);
      }
    }
  });

  // Initial load of tasks
  loadTasks();
});
