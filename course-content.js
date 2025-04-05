const urlParams = new URLSearchParams(window.location.search);
const courseId = parseInt(urlParams.get('id'));

// Variables to store course data
let currentCourse = null;
let currentChapter = null;

// Find course by ID
function findCourse(id) {
    return allCourses.find(course => course.id === id);
}

// Initialize course content page
function initCourseContent() {
    currentCourse = findCourse(courseId);
    
    if (!currentCourse) {
        document.querySelector('.course-content-container').innerHTML = 
            '<div class="error">Course not found. <a href="courses.html">Back to Courses</a></div>';
        return;
    }
    
    // Update page title
    document.title = `${currentCourse.title} - EduLearn`;
    
    // Update course header
    document.getElementById('course-title').textContent = currentCourse.title;
    document.getElementById('course-instructor').textContent = `Instructor: ${currentCourse.instructor}`;
    document.getElementById('course-description').textContent = currentCourse.description;
    
    // Display chapters
    displayChapters();
    
    // Update progress
    updateCourseProgress();
}

// Display course chapters
function displayChapters() {
    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = '';
    
    currentCourse.chapters.forEach(chapter => {
        const chapterProgress = getChapterProgress(courseId, chapter.id);
        const isComplete = chapterProgress === 100;
        const isInProgress = chapterProgress > 0 && chapterProgress < 100;
        
        const statusIcon = isComplete ? 
            '<i class="fas fa-check-circle text-success"></i>' : 
            (isInProgress ? '<i class="fas fa-spinner text-warning"></i>' : 
            '<i class="far fa-circle"></i>');
            
        const chapterItem = document.createElement('a');
        chapterItem.href = "#";
        chapterItem.className = `list-group-item list-group-item-action d-flex justify-content-between align-items-center ${currentChapter && currentChapter.id === chapter.id ? 'active' : ''}`;
        chapterItem.setAttribute('data-chapter-id', chapter.id);
        chapterItem.innerHTML = `
            <div>
                <div class="d-flex align-items-center">
                    <span class="me-2">${statusIcon}</span>
                    <strong>${chapter.title}</strong>
                </div>
                <small class="text-muted d-block mt-1">${chapter.duration}</small>
                <div class="progress progress-sm mt-2" style="width: 100px;">
                    <div class="progress-bar ${isComplete ? 'bg-success' : 'bg-primary'}" style="width: ${chapterProgress}%"></div>
                </div>
            </div>
        `;
        
        chaptersList.appendChild(chapterItem);
        
        // Add click event
        chapterItem.addEventListener('click', function(e) {
            e.preventDefault();
            const chapterId = parseInt(this.getAttribute('data-chapter-id'));
            
            // Update active state
            document.querySelectorAll('#chapters-list a').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            showChapterContent(chapterId);
        });
    });
}

// Show chapter content
function showChapterContent(chapterId) {
    currentChapter = currentCourse.chapters.find(chapter => chapter.id === chapterId);
    
    if (!currentChapter) return;
    
    const chapterContent = document.getElementById('chapter-content');
    chapterContent.innerHTML = `
        <div class="card">
            <div class="card-header bg-light">
                <h3 class="mb-0">${currentChapter.title}</h3>
            </div>
            <div class="card-body">
                <div class="content-text mb-4">
                    ${currentChapter.content}
                </div>
                <div class="video-container">
                    <div class="ratio ratio-16x9">
                        <div class="bg-light d-flex align-items-center justify-content-center p-3">
                            <div class="text-center">
                                <i class="fas fa-video fa-3x mb-3 text-secondary"></i>
                                <h5>Video content will be displayed here</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-white text-end">
                <button id="mark-complete" class="btn btn-success">
                    <i class="fas fa-check-circle me-2"></i>Mark as Complete
                </button>
            </div>
        </div>
    `;
    
    // Scroll to chapter content
    chapterContent.scrollIntoView({ behavior: 'smooth' });
    
    // Update progress when starting a chapter
    if (getChapterProgress(courseId, chapterId) === 0) {
        setChapterProgress(courseId, chapterId, 10);
        updateCourseProgress();
        displayChapters(); // Refresh chapters display
    }
    
    // Add click event to complete button
    document.getElementById('mark-complete').addEventListener('click', function() {
        setChapterProgress(courseId, chapterId, 100);
        updateCourseProgress();
        displayChapters(); // Refresh chapters display
        alert('Chapter marked as complete!');
    });
}

// Get chapter progress from localStorage
function getChapterProgress(courseId, chapterId) {
    const key = `progress_${courseId}_${chapterId}`;
    return parseInt(localStorage.getItem(key) || '0');
}

// Set chapter progress in localStorage
function setChapterProgress(courseId, chapterId, progress) {
    const key = `progress_${courseId}_${chapterId}`;
    localStorage.setItem(key, progress.toString());
}

// Update overall course progress
function updateCourseProgress() {
    if (!currentCourse) return;
    
    const chapters = currentCourse.chapters;
    let totalProgress = 0;
    
    chapters.forEach(chapter => {
        totalProgress += getChapterProgress(courseId, chapter.id);
    });
    
    const overallProgress = Math.round(totalProgress / chapters.length);
    
    // Update progress bar and text
    document.getElementById('overall-progress').style.width = `${overallProgress}%`;
    document.getElementById('progress-percentage').textContent = `${overallProgress}% Complete`;
    
    // Store overall course progress
    localStorage.setItem(`progress_${courseId}`, overallProgress.toString());
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initCourseContent);