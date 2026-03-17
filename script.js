const DEFAULT_WORK_MINUTES = 1;
const DEFAULT_BREAK_MINUTES = 5;

const timeRemaining = document.getElementById("time-remaining");
const sessionLabel = document.getElementById("session-label");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const workButton = document.getElementById("work-btn");
const breakButton = document.getElementById("break-btn");
const workMinutesInput = document.getElementById("work-minutes-input");
const applyWorkMinutesButton = document.getElementById("apply-work-minutes-btn");

let timerId = null;
let workMinutes = DEFAULT_WORK_MINUTES;
let remainingSeconds = DEFAULT_WORK_MINUTES * 60;
let activeMode = "work";
let isRunning = false;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const updateDisplay = () => {
  timeRemaining.textContent = formatTime(remainingSeconds);
};

const updateModeLabels = () => {
  workButton.textContent = `工作 ${workMinutes} 分钟`;
  breakButton.textContent = `休息 ${DEFAULT_BREAK_MINUTES} 分钟`;
};

const setMode = (mode) => {
  activeMode = mode;
  const isWork = mode === "work";
  remainingSeconds = (isWork ? workMinutes : DEFAULT_BREAK_MINUTES) * 60;
  sessionLabel.textContent = isWork ? "工作时间" : "休息时间";
  workButton.classList.toggle("active", isWork);
  breakButton.classList.toggle("active", !isWork);
  updateDisplay();
};

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isRunning = false;
};

const triggerAlert = () => {
  window.alert("倒计时结束！");
};

const tick = () => {
  if (remainingSeconds <= 0) {
    stopTimer();
    triggerAlert();
    return;
  }
  remainingSeconds -= 1;
  updateDisplay();
};

const startTimer = () => {
  if (isRunning) {
    return;
  }
  isRunning = true;
  timerId = window.setInterval(tick, 1000);
};

const pauseTimer = () => {
  stopTimer();
};

const resetTimer = () => {
  stopTimer();
  setMode(activeMode);
};

const applyCustomWorkMinutes = () => {
  const inputValue = Number.parseInt(workMinutesInput.value, 10);
  if (Number.isNaN(inputValue) || inputValue < 1) {
    workMinutesInput.value = String(workMinutes);
    return;
  }

  workMinutes = inputValue;
  updateModeLabels();

  if (activeMode === "work") {
    stopTimer();
    setMode("work");
  }
};

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

workButton.addEventListener("click", () => {
  stopTimer();
  setMode("work");
});

breakButton.addEventListener("click", () => {
  stopTimer();
  setMode("break");
});

applyWorkMinutesButton.addEventListener("click", applyCustomWorkMinutes);
workMinutesInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applyCustomWorkMinutes();
  }
});

updateModeLabels();
updateDisplay();
