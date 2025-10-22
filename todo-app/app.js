const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const task = input.value.trim();
  if (task === '') return;

  const li = document.createElement('li');
  li.textContent = task;

  // Add a class to mark as completed when clicked
  li.addEventListener('click', function() {
    li.classList.toggle('completed');
  });

  // Create the delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.className = 'delete-btn';

  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // So clicking delete doesn't also toggle completed
    li.remove();
  });

  li.appendChild(deleteBtn);
  list.appendChild(li);
  input.value = '';
});
