function getEnrolledCourses() {
    return JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
}

// Calculate total learning hours
function calculateTotalHours() {
    const enrolledIds = getEnrolledCourses();
    let totalMinutes = 0;
    
    enrolledIds.forEach(courseId => {
        const course = allCourses.find(c => c.id === courseId);
        if (course && course.chapters) {
            course.chapters.forEach(chapter => {
                // Extract minutes from duration (e.g., "45 min")
                const minutes = parseInt(chapter.duration);
                if (!isNaN(minutes)) {
                    // Only count minutes for chapters with some progress
                    const progress = getChapterProgress(courseId, chapter.id);
                    if (progress > 0) {
                        totalMinutes += minutes;
                    }
                }
            });
        }
    });
    
    // Convert to hours and round to one decimal place
    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    return hours;
}

/**
 * Updates the progress statistics display
 * Shows total progress, completed courses, and learning hours
 */
function updateProgressStats() {
    const enrolledCourses = getEnrolledCourses();
    const completedCourses = JSON.parse(localStorage.getItem('completedCourses') || '[]');

    document.getElementById('coursesInProgress').textContent = 
        enrolledCourses.length - completedCourses.length;
    document.getElementById('completedCourses').textContent = 
        completedCourses.length;
    document.getElementById('totalHours').textContent = 
        calculateTotalHours();
        
    // Show/hide no-courses message
    const noCourses = document.getElementById('no-courses');
    if (enrolledCourses.length === 0) {
        noCourses.classList.remove('d-none');
    } else {
        noCourses.classList.add('d-none');
    }
}

/**
 * Displays enrolled courses with their progress
 * @param {string} filter - Filter type ('all', 'active', 'completed')
 */
function displayEnrolledCourses(filter = 'all') {
    const enrolledCoursesDiv = document.getElementById('enrolledCourses');
    const enrolledIds = getEnrolledCourses();
    
    console.log("Enrolled course IDs:", enrolledIds);
    console.log("Available courses:", allCourses);
    
    enrolledCoursesDiv.innerHTML = '';
    
    if (enrolledIds.length === 0) {
        enrolledCoursesDiv.innerHTML = '<p>You have not enrolled in any courses yet.</p>';
        return;
    }
    
    let foundCourses = 0;
    
    enrolledIds.forEach(courseId => {
        const course = allCourses.find(c => c.id === courseId);
        if (course) {
            foundCourses++;
            
            // Calculate overall progress
            const overallProgress = getProgress(courseId);
            const progressColorClass = 
                overallProgress < 30 ? "bg-danger" : 
                overallProgress < 70 ? "bg-warning" : 
                "bg-success";
                
            // Skip if filtering
            if (filter === 'active' && overallProgress === 100) return;
            if (filter === 'completed' && overallProgress < 100) return;
            
            // Calculate completed chapters
            const completedChapters = course.chapters.filter(chapter => 
                getChapterProgress(courseId, chapter.id) === 100).length;
                
            // Get chapters progress
            const chaptersHtml = course.chapters.map(chapter => {
                const chapterProgress = getChapterProgress(courseId, chapter.id);
                return `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="small text-truncate" style="max-width: 200px;" title="${chapter.title}">${chapter.title}</span>
                            <span class="badge ${chapterProgress === 100 ? 'bg-success' : 'bg-primary'}">${chapterProgress}%</span>
                        </div>
                        <div class="progress progress-sm">
                            <div class="progress-bar ${chapterProgress < 100 ? 'bg-primary' : 'bg-success'}" 
                                 style="width: ${chapterProgress}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
            
            const courseElement = `
                <div class="col-lg-6 mb-4">
                    <div class="card h-100 shadow course-card">
                        <div class="card-header bg-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0 text-truncate" title="${course.title}">${course.title}</h5>
                                <span class="badge ${progressColorClass}">${overallProgress}%</span>
                            </div>
                        </div>
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${course.image}" class="img-fluid rounded-start h-100" alt="${course.title}" 
                                    onerror="this.src='images/default-course.jpg'" style="object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <p class="card-text">
                                        <small class="text-muted">
                                            <i class="fas fa-user me-1"></i> ${course.instructor}
                                        </small>
                                        <small class="text-muted ms-3">
                                            <i class="fas fa-layer-group me-1"></i> ${course.category}
                                        </small>
                                    </p>
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="flex-grow-1 me-2">
                                            <div class="progress">
                                                <div class="progress-bar ${progressColorClass}" style="width: ${overallProgress}%"></div>
                                            </div>
                                        </div>
                                        <span class="small text-muted">${completedChapters}/${course.chapters.length} chapters</span>
                                    </div>
                                    <div class="accordion accordion-flush" id="chapters-${courseId}">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id="heading-${courseId}">
                                                <button class="accordion-button collapsed p-2 small" type="button" 
                                                    data-bs-toggle="collapse" data-bs-target="#collapse-${courseId}">
                                                    Chapter Details
                                                </button>
                                            </h2>
                                            <div id="collapse-${courseId}" class="accordion-collapse collapse" 
                                                aria-labelledby="heading-${courseId}" data-bs-parent="#chapters-${courseId}">
                                                <div class="accordion-body p-2">
                                                    ${chaptersHtml}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-white border-top-0 d-flex justify-content-between">
                            <a href="course-content.html?id=${course.id}" class="btn btn-sm btn-primary">
                                <i class="fas fa-book-open me-1"></i> Continue
                            </a>
                            ${overallProgress === 100 ? 
                                `<span class="badge bg-success d-flex align-items-center">
                                    <i class="fas fa-check-circle me-1"></i> Completed
                                </span>` : 
                                `<span class="badge bg-info d-flex align-items-center">
                                    <i class="fas fa-spinner me-1"></i> In Progress
                                </span>`
                            }
                        </div>
                    </div>
                </div>
            `;
            enrolledCoursesDiv.innerHTML += courseElement;
        }
    });
    
    if (foundCourses === 0 && enrolledIds.length > 0) {
        enrolledCoursesDiv.innerHTML = '<p>Your enrolled courses could not be displayed. Please try again later.</p>';
        console.error("No enrolled courses found in the allCourses array, but enrolledIds exist.");
    }
}

// Get progress for a course
function getProgress(courseId) {
    const progress = localStorage.getItem(`progress_${courseId}`);
    return progress ? parseInt(progress) : 0;
}

// Get chapter progress
function getChapterProgress(courseId, chapterId) {
    const key = `progress_${courseId}_${chapterId}`;
    return parseInt(localStorage.getItem(key) || '0');
}

// Mark course as complete
function markComplete(courseId) {
    const completedCourses = JSON.parse(localStorage.getItem('completedCourses') || '[]');
    if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId);
        localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
        localStorage.setItem(`progress_${courseId}`, '100');
        updateProgressStats();
        displayEnrolledCourses();
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateProgressStats();
    displayEnrolledCourses();
    
    // Filter course views
    document.getElementById('view-all').addEventListener('click', function() {
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        displayEnrolledCourses('all');
    });
    
    document.getElementById('view-active').addEventListener('click', function() {
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        displayEnrolledCourses('active');
    });
    
    document.getElementById('view-completed').addEventListener('click', function() {
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        displayEnrolledCourses('completed');
    });
});