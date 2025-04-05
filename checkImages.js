document.addEventListener('DOMContentLoaded', function() {
    // List of expected images
    const expectedImages = [
        "images/web.jpeg",
        "images/figma.jpeg", 
        "images/business.jpeg",
        "images/default-course.jpg",
        "images/home-bg.jpg",
        "images/hero-image.png"
    ];
    
    console.log("Checking for image files...");
    
    // Check each image
    expectedImages.forEach(imagePath => {
        const img = new Image();
        img.onload = function() {
            console.log(`✓ Found: ${imagePath}`);
        };
        img.onerror = function() {
            console.error(`✗ Missing: ${imagePath}`);
        };
        img.src = imagePath;
    });
    
    // Create a console message for users
    console.log(
        "If you see 'Missing' errors above, please make sure you have these folders and files:\n" +
        "- E LEARNING/images/ folder\n" +
        "- web.jpeg, figma.jpeg, business.jpeg files inside the images folder\n" +
        "- home-bg.jpg for the homepage background\n" +
        "- hero-image.png for the hero section decoration\n" +
        "- default-course.jpg as a fallback image"
    );
});