let startTime;
let updatedTime;
let difference;
let tInterval;
let running = false;
let paused = false;
let savedTime = 0; // The time saved when pausing

// NYA VARIABLER FÖR TIDSSTÄMPLAR OCH PÅMINNELSER
let sessionStartTimeFull; // Lagrar hela Date-objektet vid sessionens start
let hourlyReminderInterval; // För att hantera timpåminnelsen

const display = document.getElementById('display');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const recordedTimeParagraph = document.getElementById('recordedTime');
const reportButton = document.getElementById('reportButton');

function startTimer() {
    if (!running) {
        // Om det är en helt ny start (inte fortsättning efter paus)
        if (savedTime === 0) {
            sessionStartTimeFull = new Date(); // Spara den fullständiga starttiden
        }
        
        startTime = new Date().getTime() - savedTime;
        tInterval = setInterval(getShowTime, 1);
        running = true;
        paused = false;
        startButton.textContent = "Start"; 
        startButton.disabled = true;
        pauseButton.disabled = false;
        stopButton.disabled = false;

        // STARTA TIMPÅMINNELSE
        // Sätter en intervall som kör sendHourlyReminder varje timme (3600000 ms)
        // Vi kör den bara om den inte redan är igång
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

        // PAUSA TIMPÅMINNELSE
        clearInterval(hourlyReminderInterval);
        hourlyReminderInterval = null; // Nollställ intervallet
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

    // STOPPA TIMPÅMINNELSE
    clearInterval(hourlyReminderInterval);
    hourlyReminderInterval = null; // Nollställ intervallet
    
    // VISA TIDSTÄMPLAR OCH RAPPORTERAD TID
    if (sessionStartTimeFull) {
        const startDate = sessionStartTimeFull.toLocaleDateString('sv-SE'); // Formatera datum
        const startHour = sessionStartTimeFull.toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'}); // Formatera tid
        recordedTimeParagraph.innerHTML = `Start: ${startDate} ${startHour}<br>Arbetad tid: ${formatTime(difference)}`;
    } else {
        recordedTimeParagraph.textContent = "Ingen tid rapporterad.";
    }
    
    reportButton.style.display = 'block'; // Make the report button visible
    sessionStartTimeFull = null; // Nollställ för nästa session
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

// NY FUNKTION FÖR TIMPÅMINNELSE
function sendHourlyReminder() {
    // För närvarande en enkel alert. Kan byggas ut senare.
    alert("Pågår arbetet fortfarande?");
}

// Initial state of buttons
startButton.disabled = false;
pauseButton.disabled = true;
stopButton.disabled = true;

// Uppdaterad Event Listener för reportButton
reportButton.addEventListener('click', () => {
    // 1. Dina specifika Google Form-detaljer 
    const formID = https://docs.google.com/forms/d/e/1FAIpQLScJOWsXlr-h0cNkH3zr4FlTLlknmZ_YjVQqRvezLPsMrLpAyw/viewform?usp=pp_url; // ID:t från din formulär-URL
    const entryDate = "entry.2124734406"; // Ditt ID för Datum
    const entryStartTime = "entry.1530281242"; // Ditt ID för Starttid
    const entryDuration = "entry.1549646041"; // Ditt ID för Arbetad tid

    // 2. Hämta värdena från appen
    const startDateStr = sessionStartTimeFull ? sessionStartTimeFull.toLocaleDateString('sv-SE') : new Date().toLocaleDateString('sv-SE');
    const startTimeStr = sessionStartTimeFull ? sessionStartTimeFull.toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'}) : "";
    const durationStr = formatTime(difference);

    // 3. Bygg URL för att skicka data
    const baseURL = `https://docs.google.com/forms/d/e/${formID}/formResponse`;
    const formData = new URLSearchParams();
    formData.append(entryDate, startDateStr);
    formData.append(entryStartTime, startTimeStr);
    formData.append(entryDuration, durationStr);

    // 4. Skicka datan
    fetch(`${baseURL}?${formData.toString()}`, {
        method: 'POST',
        mode: 'no-cors'
    }).then(() => {
        alert("Tiden har rapporterats till Google Forms!");
        reportButton.style.display = 'none'; // Dölj knappen
    }).catch(error => {
        console.error("Fel:", error);
        alert("Något gick fel.");
    });
});
});