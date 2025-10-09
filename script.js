// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.querySelector('.main-content');

    // Check if we're on mobile/tablet
    const isMobile = window.innerWidth <= 768;

    // Function to update active navigation based on scroll position
    function updateActiveNav() {
        let currentSection = '';
        const scrollPosition = isMobile ? (window.pageYOffset || document.documentElement.scrollTop) : mainContent.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in view (with some offset for better UX)
            if (scrollPosition >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            const link = item.querySelector('.nav-link');
            if (link.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    // Handle navigation clicks with smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // On mobile, scroll window, on desktop scroll mainContent
                if (isMobile) {
                    const offsetTop = targetSection.offsetTop;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    const offsetTop = targetSection.offsetTop;
                    mainContent.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Listen for scroll events to update active nav
    mainContent.addEventListener('scroll', updateActiveNav);
    window.addEventListener('scroll', updateActiveNav);

    // Initialize active nav on load
    updateActiveNav();

    // Smooth fade-in animation for project items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project items for scroll animations
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Floating Action Button functionality
    const fabButton = document.getElementById('fab-main');
    const fabMenu = document.getElementById('fab-menu');
    const fabIcon = fabButton.querySelector('.fab-icon');

    fabButton.addEventListener('click', function(e) {
        e.preventDefault();
        fabMenu.classList.toggle('active');
        
        // Rotate the icon when menu opens/closes
        if (fabMenu.classList.contains('active')) {
            fabIcon.style.transform = 'rotate(45deg)';
        } else {
            fabIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
            fabMenu.classList.remove('active');
            fabIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Close menu when scrolling
    mainContent.addEventListener('scroll', function() {
        fabMenu.classList.remove('active');
        fabIcon.style.transform = 'rotate(0deg)';
    });

    // Back to Top Button functionality
    const backToTopButton = document.getElementById('back-to-top');
    const experienceSection = document.getElementById('experience');

    function toggleBackToTopButton() {
        // On mobile, scrolling happens on window, on desktop on mainContent
        const scrollPosition = isMobile ? window.pageYOffset || document.documentElement.scrollTop : mainContent.scrollTop;
        
        let shouldShow = false;
        
        // Both mobile and desktop: show when scrolled down more than 200px
        shouldShow = scrollPosition >= 200;
        
        if (shouldShow) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Listen for scroll events on BOTH mainContent and window
    mainContent.addEventListener('scroll', toggleBackToTopButton);
    window.addEventListener('scroll', toggleBackToTopButton);

    // Initialize button visibility on page load
    toggleBackToTopButton();

    // Back to top functionality
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // On mobile, scroll window, on desktop scroll mainContent
        if (isMobile) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});

