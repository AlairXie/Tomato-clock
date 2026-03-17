const DEFAULT_WORK_MINUTES = 1;
const DEFAULT_BREAK_SECONDS = 30;

const timeRemaining = document.getElementById("time-remaining");
const sessionLabel = document.getElementById("session-label");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const workButton = document.getElementById("work-btn");
const breakButton = document.getElementById("break-btn");
const workMinutesInput = document.getElementById("work-minutes");
const breakSecondsInput = document.getElementById("break-seconds");

let timerId = null;
let workMinutes = DEFAULT_WORK_MINUTES;
let breakSeconds = DEFAULT_BREAK_SECONDS;
let remainingSeconds = DEFAULT_WORK_MINUTES * 60;
let activeMode = "work";
let isRunning = false;
let audioContext = null;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const updateDisplay = () => {
  timeRemaining.textContent = formatTime(remainingSeconds);
};

const updateWorkButtonLabel = () => {
  workButton.textContent = `工作 ${workMinutes} 分钟`;
};

const updateBreakButtonLabel = () => {
  breakButton.textContent = `休息 ${breakSeconds} 秒`;
};

const setMode = (mode) => {
  activeMode = mode;
  const isWork = mode === "work";
  remainingSeconds = isWork ? workMinutes * 60 : breakSeconds;
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

const playAlarm = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    window.alert("倒计时结束！");
    return;
  }

  if (!audioContext) {
    audioContext = new AudioCtx();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const startTime = audioContext.currentTime;
  const beepSchedule = [
    { offset: 0, duration: 0.2, frequency: 880 },
    { offset: 0.3, duration: 0.2, frequency: 988 },
    { offset: 0.6, duration: 0.35, frequency: 784 },
  ];

  beepSchedule.forEach(({ offset, duration, frequency }) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const beepStart = startTime + offset;
    const beepEnd = beepStart + duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, beepStart);

    gainNode.gain.setValueAtTime(0.0001, beepStart);
    gainNode.gain.exponentialRampToValueAtTime(0.2, beepStart + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, beepEnd);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(beepStart);
    oscillator.stop(beepEnd);
  });
};

const tick = () => {
  if (remainingSeconds <= 0) {
    playAlarm();
    setMode(activeMode === "work" ? "break" : "work");
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

const handleWorkDurationChange = () => {
  const parsedValue = Number.parseInt(workMinutesInput.value, 10);
  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    workMinutes = DEFAULT_WORK_MINUTES;
    workMinutesInput.value = String(DEFAULT_WORK_MINUTES);
  } else {
    workMinutes = parsedValue;
    workMinutesInput.value = String(parsedValue);
  }

  updateWorkButtonLabel();

  if (activeMode === "work") {
    stopTimer();
    setMode("work");
  }
};

const handleBreakDurationChange = () => {
  const parsedValue = Number.parseInt(breakSecondsInput.value, 10);
  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    breakSeconds = DEFAULT_BREAK_SECONDS;
    breakSecondsInput.value = String(DEFAULT_BREAK_SECONDS);
  } else {
    breakSeconds = parsedValue;
    breakSecondsInput.value = String(parsedValue);
  }

  updateBreakButtonLabel();

  if (activeMode === "break") {
    stopTimer();
    setMode("break");
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

workMinutesInput.addEventListener("change", handleWorkDurationChange);
workMinutesInput.addEventListener("blur", handleWorkDurationChange);
breakSecondsInput.addEventListener("change", handleBreakDurationChange);
breakSecondsInput.addEventListener("blur", handleBreakDurationChange);

updateWorkButtonLabel();
updateBreakButtonLabel();
updateDisplay();
