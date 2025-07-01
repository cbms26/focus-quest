document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("history-list");

  function loadTasks() {
    historyList.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];

    if (tasks.length === 0) {
      historyList.innerHTML =
        '<p class="no-history">Your Quest Log is empty. Go complete some missions!</p>';
      return;
    }

    tasks.sort((a, b) => b.id - a.id); // Show most recent first

    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("nes-container", "is-dark", "task-item");

      taskElement.innerHTML = `
                <div class="task-info">
                    <p class="task-title">${task.title}</p>
                    <p class="task-date">${task.date}</p>
                </div>
                <button type="button" class="nes-btn is-error delete-btn" data-id="${task.id}">
                    <i class="nes-icon close is-small"></i>
                </button>
            `;
      historyList.appendChild(taskElement);
    });
  }

  function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
    tasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
    loadTasks();
  }

  historyList.addEventListener("click", (e) => {
    // Use .closest to handle clicks on the icon inside the button
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      const taskId = Number(deleteButton.getAttribute("data-id"));
      if (
        confirm("Are you sure you want to remove this quest from your log?")
      ) {
        deleteTask(taskId);
      }
    }
  });

  loadTasks();
});
