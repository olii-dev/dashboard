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
    renderMOC();
});

function renderMOC() {
    const apiKey = '';
    const url = `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${apiKey}`;

    fetch(url)
        .then(response => {
            console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            if (data.data && data.data.languages) {
                const minutes = data.data.languages.reduce((acc, language) => acc + (language.total_seconds / 60), 0).toFixed(2);
                document.getElementById('moc').textContent = `${minutes} minutes of coding in the last 7 days`;
            } else {
                document.getElementById('moc').textContent = 'MOC data failed to load :(';
            }
        })
        .catch(error => {
            console.error('Error fetching MOC data:', error);
            document.getElementById('moc').textContent = 'MOC data failed to load :(';
        });
}