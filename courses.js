var allCourses = [
    {
        id: 1,
        title: "Web Development Fundamentals",
        instructor: "John Doe",
        category: "programming",
        image: "images/web.jpeg",
        price: "$49.99",
        description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
        chapters: [
            {
                id: 101,
                title: "Introduction to HTML",
                content: "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. This chapter covers the basic structure of HTML, tags, elements, and attributes.",
                duration: "45 min"
            },
            {
                id: 102,
                title: "CSS Fundamentals",
                content: "CSS (Cascading Style Sheets) is used to style and layout web pages. Learn about selectors, properties, values, and how to apply styles to HTML elements.",
                duration: "60 min"
            },
            {
                id: 103,
                title: "JavaScript Basics",
                content: "JavaScript is the programming language of the web. This chapter covers variables, data types, functions, and basic DOM manipulation.",
                duration: "75 min"
            }
        ]
    },
    {
        id: 2,
        title: "UI/UX Design",
        instructor: "Jane Smith",
        category: "design",
        image: "images/figma.jpeg",
        price: "$39.99",
        description: "Master the principles of user interface and user experience design.",
        chapters: [
            {
                id: 201,
                title: "Design Principles",
                content: "Learn the fundamental principles of design including balance, contrast, hierarchy, and visual consistency that form the foundation of effective UI/UX design.",
                duration: "50 min"
            },
            {
                id: 202,
                title: "User Research",
                content: "Understand different user research methodologies like interviews, surveys, and usability testing to gather insights about user needs and behaviors.",
                duration: "65 min"
            },
            {
                id: 203,
                title: "Prototyping",
                content: "Explore various prototyping tools and techniques to create interactive mockups of your designs for testing and presentation.",
                duration: "55 min"
            }
        ]
    },
    {
        id: 3,
        title: "Business Analytics",
        instructor: "Mike Johnson",
        category: "business",
        image: "images/business.jpeg",
        price: "$59.99",
        description: "Use data to make informed business decisions and strategies.",
        chapters: [
            {
                id: 301,
                title: "Data Collection",
                content: "Learn various methods of collecting relevant business data from different sources and how to ensure data quality and integrity.",
                duration: "40 min"
            },
            {
                id: 302,
                title: "Statistical Analysis",
                content: "Understand basic statistical concepts and techniques used in business analytics to interpret data and find meaningful patterns.",
                duration: "70 min"
            },
            {
                id: 303,
                title: "Data Visualization",
                content: "Master the art of presenting data in visual formats such as charts, graphs, and dashboards to communicate insights effectively.",
                duration: "60 min"
            }
        ]
    }
];

// Save course data to localStorage for cross-page access
localStorage.setItem('allCoursesData', JSON.stringify(allCourses));

/**
 * Filters and displays courses based on search criteria
 * @param {Object} filters - Contains search and category filters
 */
function displayCourses(filters = {}) {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';

    let filteredCourses = [...allCourses];

    if (filters.search) {
        filteredCourses = filteredCourses.filter(course =>
            course.title.toLowerCase().includes(filters.search.toLowerCase())
        );
    }

    if (filters.category) {
        filteredCourses = filteredCourses.filter(course =>
            course.category === filters.category
        );
    }

    filteredCourses.forEach(course => {
        const courseCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow course-card">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}" 
                         onerror="this.src='images/default-course.jpg'">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary">${course.category}</span>
                            <span class="text-primary fw-bold">${course.price}</span>
                        </div>
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text text-muted">Instructor: ${course.instructor}</p>
                        <p class="card-text">${course.description}</p>
                        <p class="card-text"><small class="text-muted">${course.chapters.length} chapters</small></p>
                    </div>
                    <div class="card-footer bg-white border-top-0">
                        <div class="d-flex gap-2">
                            <button onclick="enrollCourse(${course.id})" class="btn btn-success flex-grow-1">Enroll Now</button>
                            <a href="course-content.html?id=${course.id}" class="btn btn-outline-primary">
                                <i class="fas fa-eye"></i> Preview
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        courseList.innerHTML += courseCard;
    });
}

/**
 * Enrolls a user in a specific course
 * @param {number} courseId - The ID of the course to enroll in
 */
function enrollCourse(courseId) {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolledCourses.includes(courseId)) {
        enrolledCourses.push(courseId);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        alert('Successfully enrolled!');
    } else {
        alert('You are already enrolled in this course!');
    }
}

// Event handlers for course filtering
document.getElementById('search').addEventListener('input', (e) => {
    displayCourses({ search: e.target.value, category: document.getElementById('category').value });
});

document.getElementById('category').addEventListener('change', (e) => {
    displayCourses({ search: document.getElementById('search').value, category: e.target.value });
});

// Initial display
document.addEventListener('DOMContentLoaded', () => displayCourses());