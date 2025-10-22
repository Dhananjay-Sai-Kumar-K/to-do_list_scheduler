const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const apiUrl = 'http://localhost:4000/tasks';

// Load tasks when page loads
async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();

  list.innerHTML = '';
  tasks.forEach(task => addTaskToDOM(task));
}

// Add a new task
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false })
  });

  const newTask = await res.json();
  addTaskToDOM(newTask);
  input.value = '';
});

// Add each task visually
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  li.className = task.completed ? 'completed' : '';

  // Click to mark as completed
  li.addEventListener('click', async () => {
    const updated = await fetch(`${apiUrl}/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    const updatedTask = await updated.json();
    li.classList.toggle('completed', updatedTask.completed);
  });

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.classList.add('delete-btn');
  delBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await fetch(`${apiUrl}/${task._id}`, { method: 'DELETE' });
    li.remove();
  });

  li.appendChild(delBtn);
  list.appendChild(li);
}

// Load tasks on page start
loadTasks();
