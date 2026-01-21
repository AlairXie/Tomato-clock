const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

const timeRemaining = document.getElementById("time-remaining");
const sessionLabel = document.getElementById("session-label");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const workButton = document.getElementById("work-btn");
const breakButton = document.getElementById("break-btn");

let timerId = null;
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

const setMode = (mode) => {
  activeMode = mode;
  const isWork = mode === "work";
  remainingSeconds = (isWork ? DEFAULT_WORK_MINUTES : DEFAULT_BREAK_MINUTES) * 60;
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

updateDisplay();
