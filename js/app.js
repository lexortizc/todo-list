const taskList = document.querySelector('#task-list');

const getTasks = () => {
  let tasks;
  if(localStorage.getItem('task') === null) {
    tasks = [];
    localStorage.setItem('task', JSON.stringify(tasks));
  } else {
    tasks = JSON.parse(localStorage.getItem('task'));
  }

  return tasks;
}

const addTask = (task) => {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('task', JSON.stringify(tasks));
}

const deleteTask = (name) => {
  let tasks = getTasks();
  tasks = tasks.filter( task => task.name !== name)
  localStorage.setItem('task', JSON.stringify(tasks));
  console.log(tasks);
}

const renderTasks = () => {
  taskList.innerHTML = '';
  const tasks = getTasks();
  tasks.forEach( task => {
    const item = `<li class="task-item"><p class="priority-${task.priority}">${task.name}</p><i class="fas fa-trash-alt"></i></li>`;
    taskList.insertAdjacentHTML('beforeend', item);
  });
}

const validateTask = (task) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  if(task.name === '' || task.date < today) return false

  return true
}

window.addEventListener('load', () => {
  const today = new Date();
  document.querySelector('#dpDate').value = today.toISOString().slice(0,10);
  renderTasks();
});

document.querySelector('#btnAdd').addEventListener('click', (e) => {
  e.preventDefault();
  const task = {
    name: document.querySelector('#txtName').value,
    priority: document.querySelector('#slcPriority').value,
    status: 'new',
    date: new Date(document.querySelector('#dpDate').value + "T00:00")
  }

  if(validateTask(task)) {
    addTask(task);
    renderTasks();
  } else {
    alert('Failed to register task');
  }
  console.log(task);
})

taskList.addEventListener('click', (e) => {
  const item = e.target;
  if(item.classList.contains('fa-trash-alt')) {
    deleteTask(item.parentElement.firstChild.textContent);
    item.parentElement.remove();
  }
});