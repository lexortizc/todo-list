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
  let tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('task', JSON.stringify(tasks));
}

const renderTasks = () => {
  taskList.innerHTML = '';
  let tasks = getTasks();
  tasks.forEach( task => {
    const item = `<li><p>${task.name}</p><i class="fas fa-trash-alt"></i></li>`;
    taskList.insertAdjacentHTML('beforeend', item);
  });
}

window.addEventListener('load', renderTasks());

document.querySelector('#btnAdd').addEventListener('click', (e) => {
  e.preventDefault();
  const task = {
    name: document.querySelector('#txtName').value,
    priority: document.querySelector('#slcPriority').value,
    status: 'new',
    date: document.querySelector('#dpDate').value,
  }

  addTask(task);
  renderTasks();
  console.log(task);
})