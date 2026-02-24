// Get the buttons
const gotoTopBtn = document.getElementById('gotoTopBtn');
const gotoBottomBtn = document.getElementById('gotoBottomBtn');

// Show/hide buttons based on scroll position
window.onscroll = function() {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Show top button when scrolled down 300px
    if (scrollTop > 300) {
        gotoTopBtn.classList.add('show');
    } else {
        gotoTopBtn.classList.remove('show');
    }
    
    // Show bottom button when not at bottom and scrolled down a bit
    if (scrollTop < scrollHeight - clientHeight - 100) {
        gotoBottomBtn.classList.add('show');
    } else {
        gotoBottomBtn.classList.remove('show');
    }
};

// Scroll to top when top button is clicked
gotoTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll to bottom when bottom button is clicked
gotoBottomBtn.addEventListener('click', function() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
});

///////////////////////////////////////
// Get the buttons


// Show button when user scrolls down 300px from top
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        gotoTopBtn.classList.add('show');
    } else {
        gotoTopBtn.classList.remove('show');
    }
    
    // Show bottom button when not at bottom
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollTop < docHeight - 300) {
        gotoBottomBtn.classList.add('show');
    } else {
        gotoBottomBtn.classList.remove('show');
    }
};

