const taskList = document.querySelector('#task-list');
const dpAddDate = document.querySelector('#dpDate');
const dpUpdateDate = document.querySelector('#dpUpdateDate');
const today = new Date();
      today.setHours(0,0,0,0);

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

const autocompleteTask = (name) => {
  let tasks = getTasks();
  const task = tasks.find( task => task.name === name );
  const index = tasks.indexOf(task);

  document.querySelector('#txtUpdateIndex').value = index;
  document.querySelector('#txtUpdateName').value = task.name;
  document.querySelector('#slcUpdatePriority').value = task.priority;
  dpUpdateDate.value = task.date.slice(0,10);
}

const updateTask = (task) => {
  const index = document.querySelector('#txtUpdateIndex').value;
  let tasks = getTasks();
  tasks[index] = task;
  localStorage.setItem('task', JSON.stringify(tasks));
  applyFilters();
}

const deleteTask = (name) => {
  let tasks = getTasks();
  tasks = tasks.filter( task => task.name !== name );
  localStorage.setItem('task', JSON.stringify(tasks));
}

const changeStatusTask = (name, status) => {
  let tasks = getTasks();
  const taskIndex = tasks.findIndex( task => task.name === name );
  tasks[taskIndex].status = status;
  localStorage.setItem('task', JSON.stringify(tasks));
}

const isUpToDate = (date) => {
  const taskDate = new Date(date);
  taskDate.setHours(0,0,0,0);

  if(taskDate >= today) return true
  else return false
}

const timeLeft = (date) => {
  const taskDate = new Date(date);
  taskDate.setHours(0,0,0,0);

  const days = taskDate.getDate() - today.getDate();
  if(taskDate > today) return `<span class="bg-orange">${days} day(s) left</span>`
  else if(days === 0) return `<span class="bg-red">today</span>`
  else return `<span class="bg-blue">time reached</span>`;
}

const renderTasks = (tasks = getTasks()) => {
  taskList.innerHTML = '';
  tasks.forEach( task => {
    const item = `<tr class="task-item">
      <td class="table-cell ">${task.name}</td>
      <td class="table-cell priority-${task.priority}">${task.priority}</td>
      <td class="table-cell ">${(isUpToDate(task.date)) ? task.status : `<span class="bg-red">deferred</span>`}</td>
      <td class="table-cell ">${task.date.slice(0,10)}, ${timeLeft(task.date)}</td>
      <td class="table-cell table-opts">
        <i class="fas fa-check-square bg-${task.status}"></i>
        <i class="fas fa-pencil-alt bg-orange"></i>
        <i class="fas fa-trash-alt bg-red"></i>
      </td>
    </tr>`;
    taskList.insertAdjacentHTML('beforeend', item);
  });
}

const searchTask = (tasks, query) => {
  const results = tasks.filter( task => task.name.toLowerCase().includes(query.toLowerCase()) )
  return results;
}

const filterTasks = (tasks, filter) => {
  const results = tasks.filter( task => task.priority === filter || task.status === filter )
  return results;
}

const sortDateAsc = (tasks) => {
  tasks.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  });
  return tasks;
}

const sortDateDes = (tasks) => {
  tasks.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  });
  return tasks;
}

const sortNameAsc = (tasks) => {
  tasks.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
  return tasks;
}

const sortNameDes = (tasks) => {
  tasks.sort((a, b) => {
    if (a.name < b.name) {
      return 1;
    }
    if (a.name > b.name) {
      return -1;
    }
    return 0;
  });
  return tasks;
}

const sortTasks = (tasks, sort) => {
  switch (sort) {
    case 'dateAsc':
      tasks = sortDateAsc(tasks);
      break;
    case 'dateDes':
      tasks = sortDateDes(tasks);
      break;
    case 'nameAsc':
      tasks = sortNameAsc(tasks);
      break;
    case 'nameDes':
      tasks = sortNameDes(tasks);
      break;
  }
  return tasks;
}

const validateTask = (task) => {
  if(task.name === '' || task.date < today) return false
  return true
}

window.addEventListener('load', () => {
  dpAddDate.value = today.toISOString().slice(0,10);
  dpAddDate.min = today.toISOString().slice(0,10);
  dpUpdateDate.min = today.toISOString().slice(0,10);
  renderTasks();
});

document.querySelector('#btnAdd').addEventListener('click', (e) => {
  e.preventDefault();
  const task = {
    name: document.querySelector('#txtName').value,
    priority: document.querySelector('#slcPriority').value,
    status: 'new',
    date: new Date(dpAddDate.value + "T00:00")
  }

  if(validateTask(task)) {
    addTask(task);
    renderTasks();
  } else {
    alert('Failed to register task');
  }
})

document.querySelector('#btnUpdate').addEventListener('click', (e) => {
  e.preventDefault();
  const task = {
    name: document.querySelector('#txtUpdateName').value,
    priority: document.querySelector('#slcUpdatePriority').value,
    status: 'updated',
    date: new Date(dpUpdateDate.value + "T00:00")
  }

  if(validateTask(task)) {
    document.querySelector('.updating-section').classList.toggle('hide');
    updateTask(task);
    renderTasks();
  } else {
    alert('Failed to register task');
  }
})

taskList.addEventListener('click', (e) => {
  const action = e.target;
  const taskName = action.parentElement.parentElement.firstElementChild.textContent;

  if(action.classList.contains('fa-check-square')) {
    changeStatusTask(taskName, 'completed');
    applyFilters();
  }

  if(action.classList.contains('fa-pencil-alt')) {
    document.querySelector('.updating-section').classList.toggle('hide');
    autocompleteTask(taskName);
  }

  if(action.classList.contains('fa-trash-alt')) {
    if ( confirm("Are you sure?") ) {
      deleteTask(taskName);
      action.parentElement.parentElement.remove();
      applyFilters();
    }
  }

});

const applyFilters = () => {
  const query = document.querySelector('#txtSearch').value;
  const filter = document.querySelector('#slcFilter').value;
  const sort = document.querySelector('#slcSort').value;

  let tasks = getTasks();
  if(query !== '') {
    tasks = searchTask(tasks, query);
  }

  if(filter !== 'none') {
    tasks = filterTasks(tasks, filter);
  }

  if(sort !== 'none') {
    tasks = sortTasks(tasks, sort);
  }

  renderTasks(tasks);
}

document.querySelector('#btnSearch').addEventListener('click', (e) => {
  e.preventDefault();
  applyFilters();
})