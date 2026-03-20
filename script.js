let startTime;
let updatedTime;
let difference;
let tInterval;
let running = false;
let paused = false;
let savedTime = 0; 

let sessionStartTimeFull; 
let hourlyReminderInterval; 

const display = document.getElementById('display');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const recordedTimeParagraph = document.getElementById('recordedTime');
const reportButton = document.getElementById('reportButton');

// Din fasta e-postadress för rapportering
const userEmail = "niklas.laurell@aignitionlabs.se";

function startTimer() {
    if (!running) {
        if (savedTime === 0) {
            sessionStartTimeFull = new Date(); 
        }
        
        startTime = new Date().getTime() - savedTime;
        tInterval = setInterval(getShowTime, 1);
        running = true;
        paused = false;
        startButton.textContent = "Start"; 
        startButton.disabled = true;
        pauseButton.disabled = false;
        stopButton.disabled = false;

        if (!hourlyReminderInterval) {
            hourlyReminderInterval = setInterval(sendHourlyReminder, 3600000); 
        }
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

        clearInterval(hourlyReminderInterval);
        hourlyReminderInterval = null;
    }
}

function stopTimer() {
    clearInterval(tInterval);
    running = false;
    paused = false;
    savedTime = 0; 
    display.innerHTML = "00:00:00";
    startButton.textContent = "Start";
    startButton.disabled = false;
    pauseButton.disabled = true;
    stopButton.disabled = true;

    clearInterval(hourlyReminderInterval);
    hourlyReminderInterval = null;
    
    if (sessionStartTimeFull) {
        const startDate = sessionStartTimeFull.toLocaleDateString('sv-SE'); 
        const startHour = sessionStartTimeFull.toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'}); 
        recordedTimeParagraph.innerHTML = `Starttid: ${startDate} kl ${startHour}<br>Total arbetad tid: ${formatTime(difference)}`;
    }
    
    reportButton.style.display = 'block'; 
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

function sendHourlyReminder() {
    alert("Pågår arbetet fortfarande?");
}

// Initialt tillstånd
startButton.disabled = false;
pauseButton.disabled = true;
stopButton.disabled = true;

// Event Listeners för knappar
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);

// RAPPORTERA-KNAPPEN (Säker metod för Google Workspace)
reportButton.addEventListener('click', () => {
    // Dina specifika Google Form-detaljer
    const formID = "1FAIpQLScJOWsXlr-h0cNkH3zr4FlTLlknmZ_YjVQqRvezLPsMrLpAyw"; 
    
    const entryEmail = "entry.2093776201"; 
    const entryDate = "entry.2124734406"; 
    const entryDuration = "entry.1530281242"; 
    const entryType = "entry.1549646041"; 
    const entryCategory = "entry.1847493761"; 

    // Formatera värden
    const startDateStr = sessionStartTimeFull ? sessionStartTimeFull.toLocaleDateString('sv-SE') : new Date().toLocaleDateString('sv-SE');
    const durationStr = formatTime(difference);

    // Bygg URL för att skicka direkt via webbläsaren
    const baseURL = `https://docs.google.com/forms/d/e/${formID}/formResponse`;
    
    const params = new URLSearchParams();
    params.append(entryEmail, userEmail);
    params.append(entryDate, startDateStr);
    params.append(entryDuration, durationStr);
    params.append(entryType, "Interntid grundare");
    params.append(entryCategory, "Sälj");
    params.append("submit", "Submit"); 

    // Den slutgiltiga URL:en med parametrar
    const finalURL = `${baseURL}?${params.toString()}`;

    // Vi surfar till Google för att utnyttja inloggningen i webbläsaren
    window.location.href = finalURL;
});