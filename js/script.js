// Main JS for portfolio website - Stage 1 Enhancement
// Enhanced animations, interactions, and Ouroboros House button

// --- UI Feedback Sound ---
const clickSound = new Audio('assets/sounds/click.mp3');
let userInteracted = false;

function enableSoundOnFirstInteraction() {
    if (!userInteracted) {
        userInteracted = true;
        // Try to play and immediately pause to unlock audio on some browsers
        clickSound.play().then(() => clickSound.pause()).catch(() => { });
        window.removeEventListener('mousedown', enableSoundOnFirstInteraction);
        window.removeEventListener('keydown', enableSoundOnFirstInteraction);
        window.removeEventListener('touchstart', enableSoundOnFirstInteraction);
    }
}
window.addEventListener('mousedown', enableSoundOnFirstInteraction);
window.addEventListener('keydown', enableSoundOnFirstInteraction);
window.addEventListener('touchstart', enableSoundOnFirstInteraction);

function playClickSound() {
    if (!userInteracted) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => { });
}

// --- Page Transition Overlay ---
let pageTransition = document.getElementById('page-transition');
if (!pageTransition) {
    pageTransition = document.createElement('div');
    pageTransition.id = 'page-transition';
    pageTransition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a1a 0%, #ff8800 100%);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
    `;
    document.body.appendChild(pageTransition);
}

function triggerPageTransition(callback) {
    pageTransition.style.opacity = '1';
    pageTransition.style.pointerEvents = 'all';
    setTimeout(() => {
        if (callback) callback();
        setTimeout(() => {
            pageTransition.style.opacity = '0';
            pageTransition.style.pointerEvents = 'none';
        }, 500);
    }, 500);
}

// --- Enhanced Game-like Custom Cursor Effect (Desktop Only) ---
if (window.innerWidth > 700) {
    let cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    let cross = document.createElement('div');
    cross.className = 'custom-cursor-cross';
    cursor.appendChild(cross);
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('active');
        playClickSound();
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add hover effect for interactive elements
    const interactiveElements = 'a, button, .project-card, .project-thumb, .project-video';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
} else {
    // Show default cursor on mobile
    document.body.style.cursor = 'auto';
}

// --- Enhanced Fade-in/Slide-in on Scroll ---
function revealOnScroll() {
    const fadeEls = document.querySelectorAll('.fade-in, .slide-in');

    // Always show on mobile
    if (window.innerWidth <= 700) {
        fadeEls.forEach(el => el.classList.add('visible'));
        return;
    }

    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const revealPoint = windowHeight - 100;

        if (rect.top < revealPoint) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// --- Dynamically Load and Display Projects with Enhanced Buttons ---
fetch('projects/data.json')
    .then(response => response.json())
    .then(data => {
        const projects = data.projects;
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';

        projects.forEach((project, idx) => {
            let mediaHtml = '';

            // Add video if present
            if (project.video) {
                mediaHtml += `<video src="${project.video}" controls poster="${project.image || (project.images && project.images[0])}" class="project-video"></video>`;
            }

            // Add all images
            if (project.images && project.images.length > 0) {
                project.images.forEach(imgSrc => {
                    mediaHtml += `<img src="${imgSrc}" class="project-thumb" alt="${project.title} Screenshot">`;
                });
            } else if (project.image && !project.video) {
                mediaHtml += `<img src="${project.image}" alt="${project.title} Screenshot" class="project-thumb">`;
            }

            // Generate tech tags HTML
            let techTagsHtml = '';
            if (project.tech && project.tech.length > 0) {
                techTagsHtml = '<div class="project-tech-tags">';
                project.tech.forEach(tech => {
                    techTagsHtml += `<span class="project-tech-tag">${tech}</span>`;
                });
                techTagsHtml += '</div>';
            }

            let buttonHtml = '';

            // Special handling for The Ouroboros House
            if (project.title && project.title.toLowerCase().includes('ouroboros')) {
                buttonHtml = `<a href="https://mazen-4.itch.io/the-ouroboros-house" target="_blank" class="project-link-btn itch-btn">
                    <svg width="20" height="20" viewBox="0 0 245 220" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M31.99 1.365C21.287 7.72.2 31.945 0 38.298v10.516C0 62.144 12.46 73.86 23.644 73.86c13.527 0 10.516-13.527 23.644-13.527 13.128 0 10.517 13.527 23.644 13.527 13.128 0 10.517-13.527 23.645-13.527 13.127 0 10.516 13.527 23.644 13.527 13.127 0 10.516-13.527 23.644-13.527 13.127 0 10.516 13.527 23.644 13.527 13.127 0 10.516-13.527 23.644-13.527 13.127 0 10.517 13.527 23.644 13.527 13.127 0 23.644-11.716 23.644-25.046V38.298c-.199-6.353-21.287-30.578-31.988-36.933C180.118.197 157.056 0 122.5 0c-34.556 0-57.619.197-90.51 1.365zM122.5 170.97c-16.266 0-31.112-6.506-41.916-16.968V84.386c-.043-1.91 4.548-2.837 7.505-.524 10.052 7.858 26.153 13.537 42.99 13.537 16.836 0 32.937-5.679 42.989-13.537 2.957-2.313 7.548-1.386 7.505.524v69.617c-10.803 10.462-25.65 16.968-41.916 16.968z"/>
                        <path d="M86.497 58.116c-.044 4.536-3.143 8.202-8.094 8.202H69.39c-4.952 0-8.05-3.666-8.095-8.202a8.097 8.097 0 018.095-8.094h9.013c4.951 0 8.05 3.56 8.094 8.094zm51.456 0c-.043 4.536-3.142 8.202-8.093 8.202h-9.014c-4.951 0-8.05-3.666-8.094-8.202a8.097 8.097 0 018.094-8.094h9.014c4.951 0 8.05 3.56 8.093 8.094zm51.457 0c-.044 4.536-3.143 8.202-8.095 8.202h-9.013c-4.951 0-8.05-3.666-8.094-8.202a8.096 8.096 0 018.094-8.094h9.013c4.952 0 8.051 3.56 8.095 8.094zm-15.14 44.487c0 16.909-13.693 30.604-30.6 30.604-16.909 0-30.602-13.695-30.602-30.604 0-16.909 13.693-30.604 30.601-30.604 16.908 0 30.601 13.695 30.601 30.604z"/>
                    </svg>
                    Play on itch.io
                </a>`;
            } else if (project.link && project.link.includes('github.com')) {
                // GitHub repository button
                buttonHtml = `<a href="${project.link}" target="_blank" class="project-link-btn github-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    View on GitHub
                </a>`;
            } else if (project.link && project.link.includes('drive.google.com')) {
                // Google Drive folder/button using official Drive image link
                // Using Google's hosted Drive product icon so the logo is accurate.
                const driveImgUrl = 'https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png';
                buttonHtml = `<a href="${project.link}" target="_blank" class="project-link-btn drive-btn" aria-label="Open Drive folder">
                    <img src="${driveImgUrl}" alt="Google Drive" class="drive-icon" aria-hidden="true">
                    Open Drive
                </a>`;
            } else if (project.link && project.link.includes('venturepoint-egypt.com')) {
                // VenturePoint Egypt specific button
                buttonHtml = `<a href="${project.link}" target="_blank" class="project-link-btn website-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Visit Website
                </a>`;
            } else if (project.link) {
                // Default button for other projects
                let btnLabel = 'Download / Play';
                buttonHtml = `<a href="${project.link}" target="_blank" class="project-link-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    ${btnLabel}
                </a>`;
            }

            const card = document.createElement('div');
            card.className = 'project-card fade-in';
            card.innerHTML = `
                <div class="project-media-container">
                    <div class="project-media">
                        ${mediaHtml}
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    ${techTagsHtml}
                    <p>${project.description.replace(/\n/g, '<br>')}</p>
                    ${buttonHtml}
                </div>
            `;

            projectsList.appendChild(card);

            // Add sound effects
            card.addEventListener('mouseenter', playClickSound);
            const btn = card.querySelector('.project-link-btn');
            if (btn) {
                btn.addEventListener('click', playClickSound);
            }
        });

        // Ensure fade-in/slide-in elements are visible after cards are added
        setTimeout(revealOnScroll, 100);
    })
    .catch(error => {
        console.error('Error loading projects:', error);
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '<p style="color: #ff8800; text-align: center;">Unable to load projects. Please try again later.</p>';
    });

// --- Mobile Menu Toggle with Enhanced Animation ---
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-menu-open');
        navToggle.classList.toggle('nav-toggle-open');
        playClickSound();
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-menu-open');
            navToggle.classList.remove('nav-toggle-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('nav-menu-open');
            navToggle.classList.remove('nav-toggle-open');
        }
    });
}

// --- Page Transitions for Nav Links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.hash && document.querySelector(this.hash)) {
            e.preventDefault();
            playClickSound();
            triggerPageTransition(() => {
                const target = document.querySelector(this.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Update URL without jumping
                    history.pushState(null, null, this.hash);
                }
            });
        }
    });
});

// --- Add smooth scroll behavior ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (hash !== '#') {
            const target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// --- Add loading animation for initial page load ---
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
        revealOnScroll();
    }, 100);
});

// --- Enhanced hover effects for project cards ---
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in, .reveal').forEach(el => {
        observer.observe(el);
    });
});
