// Load experiences from API
async function loadExperiences() {
    try {
        const response = await fetch('/api/experiences');
        const experiences = await response.json();
        
        const container = document.getElementById('experience-container');
        
        if (!experiences || experiences.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #8892b0; padding: 20px;">No experiences available.</div>';
            return;
        }
        
        container.innerHTML = experiences.map(exp => {
            // Format date
            const formatDate = (dateString) => {
                if (!dateString) return 'Present';
                const [year, month] = dateString.split('-');
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
                return `${months[parseInt(month) - 1]} ${year}`;
            };
            
            const startDate = formatDate(exp.startDate);
            const endDate = exp.isPresent ? 'Present' : formatDate(exp.endDate);
            
            // Convert newlines to <br> tags for proper display
            const formattedDescription = exp.description ? exp.description.replace(/\n/g, '<br>') : '';
            
            return `
                <div class="experience-item">
                    <div class="experience-header">
                        <span class="experience-period">${startDate} - ${endDate}</span>
                        <h3 class="experience-title">${exp.position} · ${exp.company}</h3>
                    </div>
                    ${formattedDescription ? `<p class="experience-description">${formattedDescription}</p>` : ''}
                    ${exp.skills && exp.skills.length > 0 ? `
                        <div class="tech-tags" style="margin-top: 15px;">
                            ${exp.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading experiences:', error);
        const container = document.getElementById('experience-container');
        container.innerHTML = '<div style="text-align: center; color: #ff5252; padding: 20px;">Failed to load experiences. Please refresh the page.</div>';
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load experiences
    loadExperiences();
    
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

    // Download CV functionality
    const downloadCvBtn = document.getElementById('download-cv-btn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', generatePDF);
    }
});

// PDF Generation Function
async function generatePDF() {
    // Fetch experiences from database
    let experiences = [];
    try {
        const response = await fetch('/api/experiences');
        experiences = await response.json();
    } catch (error) {
        console.error('Error fetching experiences for PDF:', error);
        alert('Failed to load experiences. Generating PDF with available data.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Colors
    const primaryColor = [30, 58, 138]; // Dark blue #1e3a8a
    const darkBlue = [17, 34, 64]; // #112240
    const textGray = [100, 100, 100]; // Darker gray for better readability
    const white = [255, 255, 255];
    const accentBlue = [30, 58, 138]; // #1e3a8a
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const bottomMargin = 20; // Increased bottom margin for safety
    let yPosition = margin;
    
    // Helper function to add new page if needed
    function checkPageBreak(requiredSpace) {
        if (yPosition + requiredSpace > pageHeight - bottomMargin) {
            doc.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    }
    
    // Helper function to wrap text
    function wrapText(text, maxWidth) {
        return doc.splitTextToSize(text, maxWidth);
    }
    
    // Header with background
    doc.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Name
    doc.setFontSize(24);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('STEFAN RAMAC', margin, 20);
    
    // Title
    doc.setFontSize(14);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('DevOps Engineer', margin, 28);
    
    // Contact Information in 2x2 grid with clickable links
    doc.setFontSize(9);
    doc.setTextColor(220, 220, 220);
    
    // Top row: Email (left) and Website (right)
    doc.text('Email: stefanramac@gmail.com', margin, 38);
    doc.link(margin, 35, 70, 5, { url: 'mailto:stefanramac@gmail.com' });
    
    doc.textWithLink('Website: stefanramac.com', margin + 75, 38, { url: 'https://stefanramac.com' });
    
    // Bottom row: LinkedIn (left) and GitHub (right)
    doc.textWithLink('LinkedIn: linkedin.com/in/stefanramac', margin, 43, { url: 'https://linkedin.com/in/stefanramac' });
    
    doc.textWithLink('GitHub: github.com/stefanramac', margin + 75, 43, { url: 'https://github.com/stefanramac' });
    
    // Add profile picture (right side of header) - maintain aspect ratio
    try {
        const img = new Image();
        img.src = 'img/profile-pic.jpeg';
        // Add image with maintained aspect ratio: x, y, width (height calculated automatically)
        doc.addImage(img, 'JPEG', pageWidth - 38, 5, 28, 0, undefined, 'FAST');
    } catch (error) {
        console.log('Profile picture not found, continuing without it');
    }
    
    yPosition = 60;
    
    // Professional Summary
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 1, margin + 60, yPosition + 1);
    
    yPosition += 7;
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    
    const summary = "Results-driven IT professional with 4+ years of experience in system integrations, backend development, and cloud solutions. Specializing in designing, developing, and implementing scalable integration architectures that connect enterprise systems and applications. Expertise in Azure middleware, Software AG WebMethods, TIBCO BusinessWorks, MuleSoft, Node.js, and Java Spring Boot. Proven track record delivering solutions for international clients including Erste Bank, NLB Banks, Schneider Electric, and A1.";
    const summaryLines = wrapText(summary, pageWidth - 2 * margin);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 4 + 8;
    
    // Education
    checkPageBreak(25);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 30, yPosition + 1);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Bachelor in Electrical Engineering', margin, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Faculty of Technical Sciences, Novi Sad', margin, yPosition);
    yPosition += 10;
    
    // Nationality
    checkPageBreak(20);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('NATIONALITY', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 35, yPosition + 1);
    yPosition += 7;
    
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('Croatian (EU), Serbian (Non-EU)', margin, yPosition);
    yPosition += 10;
    
    // Languages
    checkPageBreak(25);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('LANGUAGES', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 30, yPosition + 1);
    yPosition += 7;
    
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('Serbian (Native)', margin, yPosition);
    yPosition += 5;
    doc.text('English (C1)', margin, yPosition);
    yPosition += 5;
    doc.text('German (B1)', margin, yPosition);
    yPosition += 10;
    
    // Work Experience
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 65, yPosition + 1);
    yPosition += 8;
    
    // Helper function to format date for PDF
    function formatDateForPDF(dateString) {
        if (!dateString) return 'Present';
        const [year, month] = dateString.split('-');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[parseInt(month) - 1]} ${year}`;
    }
    
    // Transform database experiences to PDF format
    const pdfExperiences = experiences.map(exp => {
        const startDate = formatDateForPDF(exp.startDate);
        const endDate = exp.isPresent ? 'Present' : formatDateForPDF(exp.endDate);
        const period = `${startDate} - ${endDate}`;
        const technologies = exp.skills && exp.skills.length > 0 ? exp.skills.join(', ') : '';
        
        return {
            period: period,
            title: exp.position,
            company: exp.company,
            description: exp.description,
            technologies: technologies
        };
    });
    
    pdfExperiences.forEach((exp, index) => {
        // Check if there's enough space for at least the header of experience (40mm)
        // This prevents splitting experience title/company from its description
        checkPageBreak(40);
        
        // Job Title (First)
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.title, margin, yPosition);
        
        yPosition += 5;
        
        // Period (Second)
        doc.setFontSize(8);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.period, margin, yPosition);
        
        yPosition += 4;
        
        // Company (Third)
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(exp.company, margin, yPosition);
        
        yPosition += 6;
        
        // Description (preserve line breaks)
        if (exp.description) {
            doc.setFontSize(8);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            
            // Split by newlines first to preserve manual line breaks
            const descriptionParagraphs = exp.description.split('\n').filter(p => p.trim());
            descriptionParagraphs.forEach((paragraph, pIndex) => {
                const descLines = wrapText(paragraph.trim(), pageWidth - 2 * margin);
                
                // Check page break for each line in the paragraph
                descLines.forEach((line, lineIndex) => {
                    checkPageBreak(5); // Check if we need a new page before each line
                    doc.text(line, margin, yPosition);
                    yPosition += 2.8; // Spacing between lines
                });
                
                // Add space between paragraphs
                if (pIndex < descriptionParagraphs.length - 1) {
                    yPosition += 1.5;
                }
            });
            yPosition += 3;
        }
        
        // Technologies/Skills
        if (exp.technologies) {
            checkPageBreak(8); // Check if there's space for skills section
            doc.setFontSize(7);
            doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
            doc.setFont('helvetica', 'bold');
            doc.text('Skills: ', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            const techLines = wrapText(exp.technologies, pageWidth - 2 * margin - 15);
            
            // Check page break for each line of skills
            techLines.forEach((line, lineIndex) => {
                if (lineIndex > 0) {
                    checkPageBreak(4);
                }
                doc.text(line, margin + 15, yPosition);
                yPosition += 3;
            });
            yPosition += 8;
        } else {
            yPosition += 6;
        }
    });
    
    // Certifications
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 40, yPosition + 1);
    yPosition += 8;
    
    const certifications = [
        'TIBCO BusinessWorks Certified Professional',
        'MuleSoft Certified Developer - Level 1',
        'Professional Scrum Master I',
        'TIBCO BusinessWorks Certified Associate',
        'AZ-900: Microsoft Azure Fundamentals',
        'PSCC-1: Consulting Certificate'
    ];
    
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    certifications.forEach(cert => {
        checkPageBreak(6);
        doc.text('- ' + cert, margin + 2, yPosition);
        yPosition += 5;
    });
    
    // Save the PDF
    doc.save('Stefan_Ramac_CV.pdf');
}

