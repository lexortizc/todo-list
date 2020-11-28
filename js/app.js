const taskList = document.querySelector('#task-list');
const dpDate = document.querySelector('#dpDate');

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
  tasks = tasks.filter( task => task.name !== name )
  localStorage.setItem('task', JSON.stringify(tasks));
}

const changeStatusTask = (name, status) => {
  let tasks = getTasks();
  const taskIndex = tasks.findIndex( task => task.name === name );
  tasks[taskIndex].status = status;
  localStorage.setItem('task', JSON.stringify(tasks));
}

const renderTasks = (tasks = getTasks()) => {
  taskList.innerHTML = '';
  tasks.forEach( task => {
    const item = `<tr class="task-item">
      <td class="table-cell ">${task.name}</td>
      <td class="table-cell priority-${task.priority}">${task.priority}</td>
      <td class="table-cell ">${task.status}</td>
      <td class="table-cell ">${task.date.slice(0,10)}</td>
      <td class="table-cell table-opts">
        <i class="fas fa-check-square bg-${task.status}"></i>
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
  const today = new Date();
  today.setHours(0,0,0,0);
  if(task.name === '' || task.date < today) return false

  return true
}

window.addEventListener('load', () => {
  const today = new Date();
  today.setHours(0,0,0,0);
  dpDate.value = today.toISOString().slice(0,10);
  dpDate.min = today.toISOString().slice(0,10);
  renderTasks();
});

document.querySelector('#btnAdd').addEventListener('click', (e) => {
  e.preventDefault();
  const task = {
    name: document.querySelector('#txtName').value,
    priority: document.querySelector('#slcPriority').value,
    status: 'new',
    date: new Date(dpDate.value + "T00:00")
  }

  if(validateTask(task)) {
    addTask(task);
    renderTasks();
  } else {
    alert('Failed to register task');
  }
})

taskList.addEventListener('click', (e) => {
  const action = e.target;
  const taskName = action.parentElement.parentElement.firstElementChild.textContent;

  if(action.classList.contains('fa-trash-alt')) {
    deleteTask(taskName);
    action.parentElement.parentElement.remove();
  }

  if(action.classList.contains('fa-check-square')) {
    changeStatusTask(taskName, 'completed');
    applyFilters();
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