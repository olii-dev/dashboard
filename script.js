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
            // Show time until sunrise
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