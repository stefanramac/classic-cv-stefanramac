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

    // Download CV functionality
    const downloadCvBtn = document.getElementById('download-cv-btn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', generatePDF);
    }
});

// PDF Generation Function
function generatePDF() {
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
    let yPosition = margin;
    
    // Helper function to add new page if needed
    function checkPageBreak(requiredSpace) {
        if (yPosition + requiredSpace > pageHeight - margin) {
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
    doc.text('Software Engineer', margin, 28);
    
    // Contact Information with clickable links
    doc.setFontSize(9);
    doc.setTextColor(220, 220, 220);
    
    // Email
    doc.text('Email: stefanramac@gmail.com', margin, 38);
    doc.link(margin, 35, 70, 5, { url: 'mailto:stefanramac@gmail.com' });
    
    // LinkedIn - clickable link
    doc.textWithLink('LinkedIn: linkedin.com/in/stefanramac', margin, 43, { url: 'https://linkedin.com/in/stefanramac' });
    
    // GitHub - clickable link
    doc.textWithLink('GitHub: github.com/stefanramac', margin + 70, 43, { url: 'https://github.com/stefanramac' });
    
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
    
    const summary = "Results-driven IT professional with 4+ years of experience in system integrations, backend development, and cloud solutions. Specializing in designing, developing, and implementing scalable integration architectures that connect enterprise systems and applications. Expertise in Azure middleware, Software AG WebMethods, TIBCO BusinessWorks, Node.js, and Java Spring Boot. Proven track record delivering solutions for international clients including Erste Bank, NLB Banks, Schneider Electric, and A1.";
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
    doc.text('German (A2)', margin, yPosition);
    yPosition += 10;
    
    // Work Experience
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 65, yPosition + 1);
    yPosition += 8;
    
    const experiences = [
        {
            period: 'July 2025 - November 2025',
            title: 'System Integration Analyst',
            company: 'Erste Banka Srbija',
            location: 'Novi Sad, Serbia',
            type: 'Contract'
        },
        {
            period: 'July 2024 - Present',
            title: 'Software Engineer',
            company: 'Eight Code',
            location: 'Serbia',
            type: 'Freelance'
        },
        {
            period: 'August 2024 - May 2025',
            title: 'Integration Specialist',
            company: 'TNation',
            location: 'Belgrade, Serbia',
            type: 'Full-time'
        },
        {
            period: 'August 2024 - May 2025',
            title: 'Integration Specialist',
            company: 'EPICO-IT (via TNation)',
            location: 'Copenhagen, Denmark',
            type: 'Contract'
        },
        {
            period: 'December 2023 - August 2024',
            title: 'Integration Platform Developer',
            company: 'NLB DigIT',
            location: 'Belgrade, Serbia',
            type: 'Full-time'
        },
        {
            period: 'December 2022 - December 2023',
            title: 'Enterprise Integration Architect',
            company: 'Schneider Electric',
            location: 'Novi Sad, Serbia',
            type: 'Full-time'
        },
        {
            period: 'August 2021 - December 2022',
            title: 'Integration Developer',
            company: 'Devoteam Serbia',
            location: 'Novi Sad, Serbia',
            type: 'Full-time'
        }
    ];
    
    experiences.forEach((exp, index) => {
        checkPageBreak(18);
        
        doc.setFontSize(8);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.period, margin, yPosition);
        
        yPosition += 4;
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.title, margin, yPosition);
        
        yPosition += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`${exp.company} - ${exp.location} - ${exp.type}`, margin, yPosition);
        
        yPosition += 8;
    });
    
    // Technical Skills
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('TECHNICAL SKILLS', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 45, yPosition + 1);
    yPosition += 8;
    
    const skills = [
        {
            category: 'Integration & Middleware',
            items: 'Software AG WebMethods, TIBCO BusinessWorks 5, Azure API Management, Azure Logic Apps, Azure Functions, Google Apigee, REST APIs, SOAP, Event Streaming'
        },
        {
            category: 'Programming & Development',
            items: 'Java, Spring Boot, Node.js, JavaScript, JSON, XML, PL/SQL'
        },
        {
            category: 'Cloud & DevOps',
            items: 'Microsoft Azure, AWS Cloud, Kubernetes, Docker, Azure DevOps, Jenkins, Bamboo, CI/CD Pipelines, Git'
        },
        {
            category: 'Databases & Messaging',
            items: 'MongoDB, SQL, RDBMS, Kafka, JMS, SMPP'
        },
        {
            category: 'API & Security',
            items: 'OAuth 2.0, JWT, API Key Authentication, mTLS, Swagger, OpenAPI'
        }
    ];
    
    skills.forEach(skill => {
        checkPageBreak(15);
        
        doc.setFontSize(9);
        doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(skill.category + ':', margin, yPosition);
        
        yPosition += 4;
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        const skillLines = wrapText(skill.items, pageWidth - 2 * margin);
        doc.text(skillLines, margin, yPosition);
        yPosition += skillLines.length * 3.5 + 4;
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
    
    yPosition += 5;
    
    // All Projects
    if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', margin, yPosition);
    doc.line(margin, yPosition + 1, margin + 25, yPosition + 1);
    yPosition += 8;
    
    const projects = [
        {
            title: 'Banking Integration Solutions - Erste Bank',
            description: 'Responsible for functional analysis, design, and implementation oversight of banking solutions with focus on system integration. Leading end-to-end integration projects including REST APIs, event streaming, and file transfers. Preparing Integration Design Documents, supporting testing execution, and maintaining integration architecture repositories.',
            tech: 'RESTful APIs, Kafka, Event Streaming, SDLC, Integration Design, Banking Sector'
        },
        {
            title: 'WebMethods Integration Platform - EPICO-IT Denmark',
            description: 'Designed, developed, and implemented integration solutions using Software AG WebMethods for XL-Byg Denmark. Created robust integration architectures connecting enterprise systems with REST and SOAP web services. Leveraged AWS cloud services for hosting and managing integration solutions. Worked extensively with MongoDB and created standardized APIs using Swagger and OpenAPI specifications.',
            tech: 'Software AG WebMethods, Java, AWS, MongoDB, REST/SOAP, OpenAPI, Jenkins'
        },
        {
            title: 'Enterprise ESB Platform - NLB Banks',
            description: 'Integration development on enterprise ESB platform building stable integrations between various enterprise solutions for NLB Banks across Slovenia, Serbia, Macedonia, Montenegro, and Croatia. Utilized Microsoft Azure for API Management and Logic Apps. Developed API proxies and flows in Google Apigee applying security standards including OAuth 2.0, JWT, and mTLS with caching and performance optimization.',
            tech: 'Azure API Management, Azure Functions, Google Apigee, SOAP, SQL/PL-SQL, mTLS, OAuth 2.0'
        },
        {
            title: 'Solution Architecture & Technical Consulting - Schneider Electric',
            description: 'Provided technical leadership for multiple concurrent projects requiring custom software design and deployment. Defined technical strategy, gathered requirements, and led solution design workshops for utility sector clients. Documented data models, functional specs, and integrations. Performed system, database, application, and network capacity planning while mentoring team members and supporting data migration design.',
            tech: 'Solution Architecture, Technical Leadership, Consulting, Project Management, Mentoring, Utility Sector'
        },
        {
            title: 'TIBCO Fulfillment Orchestration Suite - A1 Serbia',
            description: 'Developed TIBCO BW5 Fulfillment Orchestration Suite application exposed as SOAP service with invocation of backend systems mainly exposed through SOAP/HTTP and SOAP/JMS for NewBSS project. Designed Technical Products and prepared Bamboo pipelines for deployment. Developed and refactored BW5 applications and SMPP adapter for VAS (value-added) Services. Provided production support as EAI Team member.',
            tech: 'TIBCO BW5, SOAP, JMS, SMPP, Bamboo CI/CD, Telecommunications'
        },
        {
            title: 'Online Charging System - A1 Macedonia',
            description: 'Modification and development of TIBCO BW5 applications and TIBCO Fulfillment Orchestration Suite product catalog to fulfill business requirements after change of Charging system in telecommunications company. Implemented system integrations for online charging and billing processes in telecom environment.',
            tech: 'TIBCO BW5, Product Catalog, Charging Systems, Telecommunications, Billing Integration'
        }
    ];
    
    projects.forEach(project => {
        checkPageBreak(30);
        
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'bold');
        const titleLines = wrapText(project.title, pageWidth - 2 * margin);
        doc.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 5;
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const descLines = wrapText(project.description, pageWidth - 2 * margin);
        doc.text(descLines, margin, yPosition);
        yPosition += descLines.length * 3.5 + 3;
        
        doc.setFontSize(7);
        doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
        doc.setFont('helvetica', 'italic');
        const techLines = wrapText('Technologies: ' + project.tech, pageWidth - 2 * margin);
        doc.text(techLines, margin, yPosition);
        yPosition += techLines.length * 3 + 6;
    });
    
    // Footer on all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.text(`Stefan Ramac - Software Engineer | Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // Save the PDF
    doc.save('Stefan_Ramac_CV.pdf');
}

