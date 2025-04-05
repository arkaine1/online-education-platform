var allCourses = typeof allCourses !== 'undefined' 
    ? allCourses 
    : JSON.parse(localStorage.getItem('allCoursesData') || '[]');

// Sample course data
const featuredCourses = allCourses.slice(0, 3); // Changed from 2 to 3 to show three courses

/**
 * Displays featured courses on the homepage
 * Populates the course grid with enhanced course cards
 */
function displayFeaturedCourses() {
    const courseGrid = document.querySelector('.course-grid');
    courseGrid.innerHTML = '';
    
    featuredCourses.forEach(course => {
        const courseCard = `
            <div class="featured-course-wrapper">
                <div class="card h-100 featured-course-card">
                    <div class="card-img-container">
                        <img src="${course.image}" alt="${course.title}" 
                             onerror="this.src='images/default-course.jpg'">
                        <span class="badge bg-primary category-badge">${course.category}</span>
                        <div class="price-tag">${course.price}</div>
                    </div>
                    <div class="card-body">
                        <div class="instructor">
                            <div class="instructor-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <span>${course.instructor}</span>
                        </div>
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">${course.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="stats mb-3">
                            <div><i class="fas fa-book-open me-1"></i> ${course.chapters.length} chapters</div>
                            <div><i class="far fa-clock me-1"></i> ${getTotalDuration(course)} hours</div>
                        </div>
                        <div class="d-flex gap-2">
                            <button onclick="enrollCourse(${course.id})" class="btn btn-primary flex-grow-1">
                                <i class="fas fa-graduation-cap me-2"></i>Enroll Now
                            </button>
                            <a href="course-content.html?id=${course.id}" class="btn btn-outline-secondary">
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        courseGrid.innerHTML += courseCard;
    });
}

/**
 * Calculates the total duration of a course in hours
 * @param {Object} course - Course object containing chapters
 * @returns {number} Total duration in hours
 */
function getTotalDuration(course) {
    let totalMinutes = 0;
    
    course.chapters.forEach(chapter => {
        // Extract minutes from duration (e.g., "45 min")
        const minutes = parseInt(chapter.duration);
        if (!isNaN(minutes)) {
            totalMinutes += minutes;
        }
    });
    
    // Return total hours rounded to 1 decimal place
    return Math.round(totalMinutes / 60 * 10) / 10;
}

/**
 * Handles course enrollment process
 * @param {number} courseId - ID of the course to enroll in
 */
function enrollCourse(courseId) {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolledCourses.includes(courseId)) {
        enrolledCourses.push(courseId);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        console.log("Enrolled in course:", courseId);
        console.log("Current enrolled courses:", enrolledCourses);
        alert('Successfully enrolled! Go to Dashboard to view your course.');
    } else {
        alert('You are already enrolled in this course!');
    }
}

/**
 * Theme toggle functionality
 * Manages dark/light mode switching
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check user's preferred theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
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
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Login form handling
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (email && password) {
                // In a real app, you would validate with a server
                localStorage.setItem('userLoggedIn', true);
                localStorage.setItem('userEmail', email);
                
                alert('Login successful!');
                window.location.reload();
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // In a real app, you would send this data to a server
            localStorage.setItem('userLoggedIn', true);
            localStorage.setItem('userEmail', email);
            
            alert('Account created successfully!');
            window.location.reload();
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedCourses();
    initThemeToggle();
    initAuthForms();
});