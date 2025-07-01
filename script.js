document.addEventListener("DOMContentLoaded", () => {
  // GLobal Constants
  const FOCUS_TIME = 25;
  const BREAK_TIME = 5;
  const REPS_PER_CYCLE = 3;

  // DOM Elements
  const timeDisplay = document.getElementById("time-display");
  const startPauseBtn = document.getElementById("start-pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const statusMessage = document.getElementById("status-message");
  const statusTitle = document.getElementById("status-title");
  const repsIconsContainer = document.getElementById("reps-icons");
  const body = document.body;

  // Audio Elements
  const repSound = document.getElementById("sound-rep-complete");
  const cycleSound = document.getElementById("sound-cycle-complete");

  // Game states
  let timerInterval = null;
  let currentMinutes = FOCUS_TIME;
  let currentSeconds = 0;
  let isRunning = false;
  let mode = "focus";
  let repsCompleted = 0;

  // --- Core Game Loop ---
  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startPauseBtn.textContent = "Pause";
    startPauseBtn.classList.remove("is-success");
    startPauseBtn.classList.add("is-warning");

    timerInterval = setInterval(() => {
      if (currentSeconds === 0) {
        if (currentMinutes === 0) {
          handleSessionEnd();
          return;
        }
        currentMinutes--;
        currentSeconds = 59;
      } else {
        currentSeconds--;
      }
      updateDisplay();
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = "Start";
    startPauseBtn.classList.remove("is-warning");
    startPauseBtn.classList.add("is-success");
  }

  function resetTimer() {
    pauseTimer();
    repsCompleted = 0;
    setMode("focus");
    updateRepsDisplay();
  }

  function handleSessionEnd() {
    pauseTimer();

    if (mode === "focus") {
      repsCompleted++;
      updateRepsDisplay();

      if (repsCompleted === REPS_PER_CYCLE) {
        cycleSound.play();
        promptAndSaveTask();
        repsCompleted = 0; // Reset for the next full cycle
        // A small delay before updating hearts, so to give a sense of completion
        setTimeout(updateRepsDisplay, 500);
      } else {
        repSound.play();
      }
      setMode("break");
    } else {
      setMode("focus");
    }

    setTimeout(() => startTimer(), 1000);
  }

  function promptAndSaveTask() {
    const taskTitle = prompt("Mission Complete! Name your completed quest:");
    if (taskTitle && taskTitle.trim() !== "") {
      const completedTask = {
        id: Date.now(),
        title: taskTitle.trim(),
        date: new Date().toLocaleString(),
      };
      const tasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
      tasks.push(completedTask);
      localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
      alert(`Quest "${taskTitle}" saved to your Quest Log!`);
    } else {
      alert("Quest was not named and has been lost to time...");
    }
  }

  // --- UI and State Updates ---
  function updateDisplay() {
    const minutes = String(currentMinutes).padStart(2, "0");
    const seconds = String(currentSeconds).padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${seconds}`;
    document.title = `${minutes}:${seconds} - Focus Quest`;
  }

  function setMode(newMode) {
    mode = newMode;
    if (mode === "focus") {
      currentMinutes = FOCUS_TIME;
      statusTitle.textContent = "Focus!";
      statusMessage.textContent = `Level ${repsCompleted + 1}`;
      body.classList.remove("break-mode");
      body.classList.add("focus-mode");
    } else {
      currentMinutes = BREAK_TIME;
      statusTitle.textContent = "Break Time";
      statusMessage.textContent = "Bonus Stage!";
      body.classList.remove("focus-mode");
      body.classList.add("break-mode");
    }
    currentSeconds = 0;
    updateDisplay();
  }

  function updateRepsDisplay() {
    repsIconsContainer.innerHTML = ""; // Clear existing hearts
    for (let i = 0; i < REPS_PER_CYCLE; i++) {
      const heartIcon = document.createElement("i");
      heartIcon.classList.add("nes-icon", "heart");
      if (i >= repsCompleted) {
        heartIcon.classList.add("is-empty");
      }
      repsIconsContainer.appendChild(heartIcon);
    }
  }

  // --- Event Listeners ---
  startPauseBtn.addEventListener("click", () => {
    isRunning ? pauseTimer() : startTimer();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to abandon this quest?")) {
      resetTimer();
    }
  });

  // Initial setup
  setMode("focus");
  updateRepsDisplay();
});
