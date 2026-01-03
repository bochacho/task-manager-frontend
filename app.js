document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if( !token){
        window.location.href = 'index.html';
        return;
   }
   setupEventListeners()
   loadTasks();
})


function initDashboard(){
    displayUserName();
    setupEventListeners();
}

function displayUserName() {
    const user = JSON.parse( localStorage.getItem('user') );
    const user_name = document.getElementById('user-name');
    user_name.textContent = `Hello, ${user.name}`;
}

function setupEventListeners() {
    const logout_btn = document.getElementById('logout-btn');
    const create_task = document.getElementById('create-task-form');

    const dd_status = document.getElementById('filter-status');
    const dd_priority = document.getElementById('filter-priority');
    const dd_sort = document.getElementById('filter-sort');
    
    // Logout
    logout_btn.addEventListener('click', () => {
        handleLogout()
    })


    create_task.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-description').value;
            const status = document.getElementById('task-status').value;
            const priority = document.getElementById('task-priority').value;
            const dueDate = document.getElementById('task-due-date').value;
            
            const taskData = { title, description, status, priority, dueDate };
            const response = await api.createTask(taskData);
            
            showMessage('Task created successfully!', 'success');
            
            e.target.reset();
            
            addTaskToDOM(response.data);
            
        } catch (error) {
            showMessage('Failed to create task: ' + error.message, 'error');
        }
    });

    dd_status.addEventListener('change', () => {
        loadTasks()
    })

    dd_priority.addEventListener('change', () => {
        loadTasks();
    })

    dd_sort.addEventListener('change', () => {
        loadTasks();
    });
}

async function loadTasks() {
  try {
    const statusFilter = document.getElementById('filter-status').value;
    const priorityFilter = document.getElementById('filter-priority').value;
    const sortFilter = document.getElementById('filter-sort').value;
    
    const filters = {
      status: statusFilter,
      priority: priorityFilter,
      sort: sortFilter
    };
    
    Object.keys(filters).forEach(key => {
      if (!filters[key]) {
        delete filters[key];
      }
    });
    
    const response = await api.getTasks(filters);  // ← Pass filters here!
    const tasks = response.data;
    displayTasks(tasks);
    
  } catch (error) {
    showMessage('Failed to load tasks: ' + error.message, 'error');
    if (error.message.includes('Unauthorized')) {
      setTimeout(() => handleLogout(), 2000);
    }
  }
}


function displayTasks(tasks) {
    const container = document.getElementById('tasks-container');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p>No tasks found. Create one above!</p>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-card" data-id="${task._id}">
        <h4>${task.title}</h4>
        ${task.description ? `<p>${task.description}</p>` : ''}
        <div class="task-meta">
            <span class="badge badge-${task.status}">${task.status}</span>
            <span class="badge badge-${task.priority}">${task.priority}</span>
        </div>
        <div class="task-actions">
            <button class="btn-small" onclick="editTask('${task._id}')">Edit</button>
            <button class="btn-small btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
        </div>
        </div>
    `).join('');
}


function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `show ${type}`;
  
  setTimeout(() => {
    messageDiv.className = '';
  }, 3000);
}
function addTaskToDOM(task) {
  const container = document.getElementById('tasks-container');

  const taskHTML = `
      <div class="task-card" data-id="${task._id}">
        <h4>${task.title}</h4>
        ${task.description ? `<p>${task.description}</p>` : ''}
        <div class="task-meta">
            <span class="badge badge-${task.status}">${task.status}</span>
            <span class="badge badge-${task.priority}">${task.priority}</span>
        </div>
        <div class="task-actions">
            <button class="btn-small" onclick="editTask('${task._id}')">Edit</button>
            <button class="btn-small btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      </div>
    `
  if (container.innerHTML.includes('No tasks found')) {
    container.innerHTML = taskHTML
    return;
  }
  
  container.insertAdjacentHTML('afterbegin', taskHTML)
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    await api.deleteTask(taskId);
    
    showMessage("Task deleted successfully", "success")
    
    const taskCard = document.querySelector(`[data-id="${taskId}"]`);
    taskCard.remove();

    const remainingTasks = document.querySelectorAll('.task-card');
    if (remainingTasks.length === 0) {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '<p>No tasks found. Create one above!</p>';
    }
  } catch (error) {
    showMessage(error.message, "error")
  }
}