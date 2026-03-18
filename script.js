let startTime;
let updatedTime;
let difference;
let tInterval;
let running = false;
let paused = false;
let savedTime = 0; // The time saved when pausing

const display = document.getElementById('display');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const recordedTimeParagraph = document.getElementById('recordedTime');
const reportButton = document.getElementById('reportButton');

function startTimer() {
    if (!running) {
        startTime = new Date().getTime() - savedTime;
        tInterval = setInterval(getShowTime, 1);
        running = true;
        paused = false;
        startButton.textContent = "Start";
        startButton.disabled = true;
        pauseButton.disabled = false;
        stopButton.disabled = false;
    }
}

function pauseTimer() {
    if (running && !paused) {
        clearInterval(tInterval);
        savedTime = difference;
        paused = true;
        running = false;
        startButton.textContent = "Fortsätt";
        startButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = false;
    }
}

function stopTimer() {
    clearInterval(tInterval);
    running = false;
    paused = false;
    savedTime = 0; // Reset saved time
    display.innerHTML = "00:00:00";
    startButton.textContent = "Start";
    startButton.disabled = false;
    pauseButton.disabled = true;
    stopButton.disabled = true;
    
    // Show recorded time and report button
    recordedTimeParagraph.textContent = "Tid rapporterad: " + formatTime(difference);
    reportButton.style.display = 'block'; // Make the report button visible
}

function getShowTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    display.innerHTML = hours + ":" + minutes + ":" + seconds;
}

function formatTime(ms) {
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

// Initial state of buttons
startButton.disabled = false;
pauseButton.disabled = true;
stopButton.disabled = true;

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);
reportButton.addEventListener('click', () => {
    // This is where we'll implement the Google Forms integration later
    alert("Rapportera Tid funktionen kommer snart!");
});