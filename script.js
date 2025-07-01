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
    // If timer is already running, exit the function
    if (isRunning) {
      return;
    }

    // Update timer state and button appearance
    isRunning = true;
    startPauseBtn.textContent = "Pause";
    startPauseBtn.classList.remove("is-success");
    startPauseBtn.classList.add("is-warning");

    // Start the timer interval
    timerInterval = setInterval(function () {
      // If seconds reach zero
      if (currentSeconds === 0) {
        // If both minutes and seconds are zero
        if (currentMinutes === 0) {
          handleSessionEnd();
          return;
        }
        // Decrement minutes and reset seconds
        currentMinutes = currentMinutes - 1;
        currentSeconds = 59;
      } else {
        // Decrement seconds
        currentSeconds = currentSeconds - 1;
      }
      updateDisplay();
    }, 1000);
  }

  function pauseTimer() {
    // Stop the timer interval
    clearInterval(timerInterval);

    // Update timer state and button appearance
    isRunning = false;
    startPauseBtn.textContent = "Start";
    startPauseBtn.classList.remove("is-warning");
    startPauseBtn.classList.add("is-success");
  }

  function resetTimer() {
    // Stop the timer and reset all values
    pauseTimer();
    repsCompleted = 0;
    setMode("focus");
    updateRepsDisplay();
  }

  function handleSessionEnd() {
    // Pause the current timer
    pauseTimer();

    // Handle focus mode completion
    if (mode === "focus") {
      // Increment completed repetitions
      repsCompleted = repsCompleted + 1;
      updateRepsDisplay();

      // Check if full cycle is completed
      if (repsCompleted === REPS_PER_CYCLE) {
        cycleSound.play();
        promptAndSaveTask();
        // Reset for the next full cycle
        repsCompleted = 0;
        // Add a small delay before updating hearts for visual feedback
        setTimeout(function () {
          updateRepsDisplay();
        }, 500);
      } else {
        repSound.play();
      }
      setMode("break");
    } else {
      setMode("focus");
    }

    // Start next session after a delay
    setTimeout(function () {
      startTimer();
    }, 1000);
  }

  function promptAndSaveTask() {
    // Ask user for task name
    const taskTitle = prompt("Mission Complete! Name your completed quest:");

    // Check if task title exists and is not empty
    if (taskTitle && taskTitle.trim().length > 0) {
      // Create new task object
      const completedTask = {
        id: Date.now(),
        title: taskTitle.trim(),
        date: new Date().toLocaleString(),
      };

      // Get existing tasks or initialize empty array
      let tasks = [];
      const savedTasks = localStorage.getItem("pomodoroTasks");
      if (savedTasks) {
        tasks = JSON.parse(savedTasks);
      }

      // Add new task and save
      tasks.push(completedTask);
      localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
      alert('Quest "' + taskTitle + '" saved to your Quest Log!');
    } else {
      alert("Quest was not named and has been lost to time...");
    }
  }

  // --- UI and State Updates ---
  function updateDisplay() {
    // Format minutes and seconds with leading zeros
    let minutes = String(currentMinutes);
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }

    let seconds = String(currentSeconds);
    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }

    // Update display and page title
    timeDisplay.textContent = minutes + ":" + seconds;
    document.title = minutes + ":" + seconds + " - Focus Quest";
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
