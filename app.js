document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if( !token){
        window.location.href = 'index.html';
        return;
   }
   initDashboard();
})



function displayUserName() {
    const user = JSON.parse( localStorage.getItem('user') );
    const user_name = document.getElementById('user-name');
    user_name.textContent = `Hello, ${user.name}`;
}

function setupEventListeners() {
  // 2. Add submit listener to 'create-task-form' → call handleCreateTask
  // 3. Add change listeners to the three filter dropdowns → call loadTasks

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

function loadTasks() {

}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Show message to user
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `show ${type}`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageDiv.className = '';
  }, 3000);
}