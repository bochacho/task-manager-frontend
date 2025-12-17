document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if(token){
        window.location.href = 'dashboard.html';
        return;
   }
   
   setupFormToggle();
   setupRegisterForm();
   setupLoginForm();
})

function setupFormToggle() {
    const showRegistrationLink = document.getElementById('show-register')
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    showRegistrationLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    })

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    })
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            showMessage('Logging in...', 'success');

            const response = await api.login(email, password)

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showMessage(error.message, 'error')
        }
    })
} 

function setupRegisterForm() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        try {
            showMessage('Creating account...', 'success');

            const response = await api.register(name, email, password)

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            showMessage('Registration successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showMessage(error.message, 'error')
        }
    })
} 

function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `show ${type}`;  // Adds 'show' and 'success'/'error'
}