(function() {
    // Check if we need to load course data from localStorage
    if (typeof allCourses === 'undefined') {
        console.log('Loading course data from localStorage');
        window.allCourses = JSON.parse(localStorage.getItem('allCoursesData') || '[]');
    } else {
        console.log('Course data already loaded');
    }

    // Debug enrolled courses
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    console.log('Currently enrolled courses:', enrolledCourses);
})();