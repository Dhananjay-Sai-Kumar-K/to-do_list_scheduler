const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const task = input.value.trim();
  if (task === '') return;

  const li = document.createElement('li');
  li.textContent = task;

  // Create the delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.className = 'delete-btn';

  // When delete is clicked, remove this task from the list
  deleteBtn.addEventListener('click', function() {
    li.remove();
  });

  li.appendChild(deleteBtn);
  list.appendChild(li);
  input.value = '';
});
