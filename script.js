function updateTime() {
    const now = new Date();
    const options = { timeZone: 'Australia/Adelaide', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', options);
}
setInterval(updateTime, 1000);
updateTime();

function displayRandomQuote() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quote = quotes[dayOfYear % quotes.length];
    document.getElementById('quote').textContent = quote;
}
displayRandomQuote();

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    return tasks ? tasks : [];
}

function renderTasks() {
    const tasks = loadTasks();
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach(taskText => {
        const taskItem = document.createElement('li');
        taskItem.textContent = taskText;
        taskItem.addEventListener('click', () => {
            removeTask(taskText);
        });
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const tasks = loadTasks();
        tasks.push(taskText);
        saveTasks(tasks);
        renderTasks();
        taskInput.value = "";
    }
}

function removeTask(taskText) {
    let tasks = loadTasks();
    tasks = tasks.filter(task => task !== taskText);
    saveTasks(tasks);
    renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    fetchTimeSpentCoding();
    updateTimeUntil();
    loadTimer();
});

function fetchTimeSpentCoding() {
    fetch('time-coding.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('timeSpentCoding').textContent = data.Time;
        })
        .catch(error => {
            console.error('Error fetching time spent coding:', error);
            document.getElementById('timeSpentCoding').textContent = 'Could not load time spent coding data.';
        });
}

function updateTimeUntil() {
    const sunsetHour = 17;
    const sunsetMinute = 15;
    const sunriseHour = 7;
    const sunriseMinute = 10;
    const now = new Date();
    const sunsetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunsetHour, sunsetMinute);
    const sunriseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunriseHour, sunriseMinute);

    if (now > sunsetTime) {
        sunsetTime.setDate(sunsetTime.getDate() + 1);
    }
    if (now > sunriseTime) {
        sunriseTime.setDate(sunriseTime.getDate() + 1);
    }

    setInterval(() => {
        const now = new Date();
        if (now > sunsetTime) {
            const timeUntilSunrise = sunriseTime - now;
            if (timeUntilSunrise > 0) {
                const hours = Math.floor(timeUntilSunrise / 1000 / 60 / 60);
                const minutes = Math.floor((timeUntilSunrise / 1000 / 60) % 60);
                const seconds = Math.floor((timeUntilSunrise / 1000) % 60);
                document.getElementById('timeUntil').textContent = `Time till sunrise: ${hours}h ${minutes}m ${seconds}s`;
                document.getElementById('timeUntil').classList.remove('hidden');
            } else {
                document.getElementById('timeUntil').textContent = 'The sun has risen.';
                document.getElementById('timeUntil').classList.add('hidden');
            }
        } else {
            const timeUntilSunset = sunsetTime - now;
            if (timeUntilSunset > 0) {
                const hours = Math.floor(timeUntilSunset / 1000 / 60 / 60);
                const minutes = Math.floor((timeUntilSunset / 1000 / 60) % 60);
                const seconds = Math.floor((timeUntilSunset / 1000) % 60);
                document.getElementById('timeUntil').textContent = `Time till sunset: ${hours}h ${minutes}m ${seconds}s`;
                document.getElementById('timeUntil').classList.remove('hidden');
            } else {
                document.getElementById('timeUntil').textContent = 'The sun has set.';
                document.getElementById('timeUntil').classList.add('hidden');
            }
        }
    }, 1000);
}

function searchGoogle() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput !== "") {
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchInput)}`;
        window.open(url, '_blank');
    }
}

function startTimer() {
    const timerName = document.getElementById('timerName').value.trim();
    const minutes = parseInt(document.getElementById('timerMinutes').value, 10) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value, 10) || 0;
    let totalTime = minutes * 60 + seconds;

    if (totalTime > 0) {
        const timerData = {
            name: timerName,
            totalTime: totalTime,
            endTime: Date.now() + totalTime * 1000
        };
        localStorage.setItem('timer', JSON.stringify(timerData));
        updateTimerDisplay(timerData);
        timer = setInterval(() => {
            const now = Date.now();
            const remainingTime = timerData.endTime - now;
            if (remainingTime <= 0) {
                clearInterval(timer);
                alert('Timer is complete!');
                localStorage.removeItem('timer');
                document.getElementById('timerDisplay').textContent = 'Timer ended.';
            } else {
                timerData.totalTime = Math.floor(remainingTime / 1000);
                localStorage.setItem('timer', JSON.stringify(timerData));
                updateTimerDisplay(timerData);
            }
        }, 1000);
    }
}

function updateTimerDisplay(timerData) {
    const displayMinutes = Math.floor(timerData.totalTime / 60);
    const displaySeconds = timerData.totalTime % 60;
    document.getElementById('timerDisplay').textContent = `Time remaining for ${timerData.name ? timerData.name + ': ' : ''}${displayMinutes}m ${displaySeconds}s`;
}

function loadTimer() {
    const timerData = JSON.parse(localStorage.getItem('timer'));
    if (timerData) {
        const now = Date.now();
        const remainingTime = timerData.endTime - now;
        if (remainingTime > 0) {
            timerData.totalTime = Math.floor(remainingTime / 1000);
            timer = setInterval(() => {
                const now = Date.now();
                const remainingTime = timerData.endTime - now;
                if (remainingTime <= 0) {
                    clearInterval(timer);
                    alert('Timer is complete!');
                    localStorage.removeItem('timer');
                    document.getElementById('timerDisplay').textContent = 'Timer ended.';
                } else {
                    timerData.totalTime = Math.floor(remainingTime / 1000);
                    localStorage.setItem('timer', JSON.stringify(timerData));
                    updateTimerDisplay(timerData);
                }
            }, 1000);
            updateTimerDisplay(timerData);
        } else {
            localStorage.removeItem('timer');
            document.getElementById('timerDisplay').textContent = 'Timer ended.';
        }
    }
}
