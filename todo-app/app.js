const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const select = document.getElementById('priority-select');
const deadlineInput = document.getElementById('deadline');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');

const apiUrl = 'http://localhost:4000/tasks';

// -------------------- LOAD TASKS --------------------
async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();

  list.innerHTML = '';
  tasks.forEach(task => addTaskToDOM(task));
  updateProgress();
}

// -------------------- ADD NEW TASK --------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const priority = select.value;
  const deadline = deadlineInput.value || null;
  if (!text) return;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, priority, deadline, completed: false })
  });
  const newTask = await res.json();
  addTaskToDOM(newTask);

  input.value = '';
  deadlineInput.value = '';
  select.value = 'normal';

  updateProgress();
});

// -------------------- ADD TASK TO DOM --------------------
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  li.className = task.completed ? 'completed' : '';
  li.dataset.priority = task.priority || 'normal';

  // Click to toggle completion
  li.addEventListener('click', async () => {
    const updated = await fetch(`${apiUrl}/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    const updatedTask = await updated.json();
    li.classList.toggle('completed', updatedTask.completed);
    updateProgress();
  });

  // Show deadline time
  if (task.deadline) {
    const small = document.createElement('small');
    const deadlineDate = new Date(task.deadline);
    const timeLeft = getTimeDifference(deadlineDate);
    small.textContent = `🕒 ${formatDate(deadlineDate)} (${timeLeft})`;
    small.style.opacity = 0.8;
    small.style.fontSize = '0.8em';
    li.appendChild(small);
  }

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.classList.add('delete-btn');
  delBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await fetch(`${apiUrl}/${task._id}`, { method: 'DELETE' });
    li.remove();
    updateProgress();
  });

  li.appendChild(delBtn);
  list.appendChild(li);
}

// -------------------- PROGRESS BAR --------------------
async function updateProgress() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();

  if (tasks.length === 0) {
    progressBar.style.width = '0%';
    progressText.innerText = '0% Completed';
    return;
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const percent = Math.round((completedTasks / tasks.length) * 100);

  progressBar.style.width = `${percent}%`;
  progressText.innerText = `${percent}% Completed`;
}

// -------------------- DARK MODE TOGGLE --------------------
themeToggle.addEventListener('click', () => {
  const current = document.body.dataset.theme;
  if (current === 'dark') {
    document.body.dataset.theme = 'light';
    themeToggle.textContent = '🌞';
  } else {
    document.body.dataset.theme = 'dark';
    themeToggle.textContent = '🌙';
  }
});

// -------------------- DEADLINE HELPERS --------------------
function formatDate(date) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function getTimeDifference(deadline) {
  const now = new Date();
  const diff = deadline - now;
  if (diff <= 0) return 'Expired';
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;
}

// -------------------- INIT --------------------
loadTasks();
