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
    updateTimeUntil();
    loadTimers();
});

function searchGoogle() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput !== "") {
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchInput)}`;
        window.open(url, '_blank');
    }
}

let timers = [];

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
        timers.push(timerData);
        saveTimers();
        updateTimerDisplay(timerData);

        const timerInterval = setInterval(() => {
            const now = Date.now();
            const remainingTime = timerData.endTime - now;
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                alert(`'${timerData.name}' timer is complete!`);
                removeTimer(timerData);
                document.getElementById('timerDisplay').textContent = 'Timer ended.';
            } else {
                timerData.totalTime = Math.floor(remainingTime / 1000);
                saveTimers();
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

function saveTimers() {
    localStorage.setItem('timers', JSON.stringify(timers));
}

function loadTimers() {
    const savedTimers = JSON.parse(localStorage.getItem('timers'));
    if (savedTimers) {
        timers = savedTimers;
        timers.forEach(timerData => {
            updateTimerDisplay(timerData);
        });
    }
}

function removeTimer(timerData) {
    timers = timers.filter(timer => timer !== timerData);
    saveTimers();
    renderTimers();
}

function renderTimers() {
    const timerList = document.getElementById('timerList');
    timerList.innerHTML = '';
    timers.forEach(timerData => {
        const listItem = document.createElement('li');
        listItem.textContent = `Timer: ${timerData.name}, Time remaining: ${Math.floor(timerData.totalTime / 60)}m ${timerData.totalTime % 60}s`;
        timerList.appendChild(listItem);
    });
}

function getTimeUntilSunset() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`)
                .then(response => response.json())
                .then(data => {
                    const sunsetTimeUTC = new Date(data.results.sunset);
                    const currentTime = new Date();

                    const sunsetTimeLocal = new Date(sunsetTimeUTC.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

                    const diff = sunsetTimeLocal - currentTime;
                    if (diff > 0) {
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        document.getElementById("timeUntil").textContent = `Time until sunset: ${hours}h ${minutes}m`;
                    } else {
                        document.getElementById("timeUntil").textContent = `Sunset has happened.`;
                    }
                })
                .catch(err => console.error("Error fetching sunset data:", err));
        });
    } else {
        document.getElementById("timeUntil").textContent = "Geolocation not supported.";
    }
}

getTimeUntilSunset();
setInterval(getTimeUntilSunset, 60000);

function fetchLatestNews(category = 'technology') {
    const apiKey = 'pub_5968200e94f970c07107743b6a2204c9e41ba';
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=au&category=${category}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById('newsList');
            if (data.results && data.results.length > 0) {
                newsList.innerHTML = '';
                const limitedResults = data.results.slice(0, 3);
                limitedResults.forEach(article => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="${article.link}" target="_blank">${article.title}</a>`;
                    newsList.appendChild(listItem);
                });
            } else {
                newsList.textContent = 'No news available at the moment.';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            document.getElementById('newsList').textContent = 'Could not load news data.';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLatestNews('technology');
});

function fetchAndDisplayNews(category = 'technology') {
    const apiKey = 'pub_5968200e94f970c07107743b6a2204c9e41ba';
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=au&category=${category}`;


    const lastUpdateTime = localStorage.getItem('lastNewsUpdateTime');
    const now = new Date().getTime();
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;

    if (!lastUpdateTime || now - lastUpdateTime >= twoHoursInMilliseconds) {
        localStorage.setItem('lastNewsUpdateTime', now);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const newsList = document.getElementById('newsList');
                newsList.innerHTML = '';
                if (data.results && data.results.length > 0) {
                    const limitedResults = data.results.slice(0, 3);
                    limitedResults.forEach(article => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<a href="${article.link}" target="_blank">${article.title}</a>`;
                        newsList.appendChild(listItem);
                    });
                } else {
                    newsList.textContent = 'No news available at the moment.';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                document.getElementById('newsList').textContent = 'Could not load news data.';
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayNews('technology');
});

setInterval(() => fetchAndDisplayNews('technology'), 2 * 60 * 60 * 1000);
