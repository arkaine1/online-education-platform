function checkAuthState() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    const authButtons = document.querySelectorAll('.auth-buttons');
    const userInfo = document.querySelectorAll('.user-info');
    
    if (isLoggedIn && userEmail) {
        // User is logged in, show user info and hide auth buttons
        authButtons.forEach(element => element.classList.add('d-none'));
        userInfo.forEach(element => {
            element.classList.remove('d-none');
            const emailSpan = element.querySelector('.user-email');
            if (emailSpan) {
                emailSpan.textContent = userEmail;
            }
        });
    } else {
        // User is not logged in, show auth buttons and hide user info
        authButtons.forEach(element => element.classList.remove('d-none'));
        userInfo.forEach(element => element.classList.add('d-none'));
    }
}

// Handle logout
function handleLogout() {
    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.reload();
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const htmlElement = document.documentElement;
    
    // Check user's preferred theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        updateThemeIcon('dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize everything related to auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    handleLogout();
    initThemeToggle();
});