// Main JS for portfolio website
// Add scroll animations and interactivity here

// --- UI Feedback Sound ---
const clickSound = new Audio('assets/sounds/click.mp3');
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// --- Page Transition Overlay ---
let pageTransition = document.getElementById('page-transition');
if (!pageTransition) {
    pageTransition = document.createElement('div');
    pageTransition.id = 'page-transition';
    document.body.appendChild(pageTransition);
}

function triggerPageTransition(callback) {
    pageTransition.classList.add('active');
    setTimeout(() => {
        if (callback) callback();
        setTimeout(() => pageTransition.classList.remove('active'), 500);
    }, 500);
}

// --- Enhanced Game-like Custom Cursor Effect ---
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
document.addEventListener('mousedown', () => cursor.classList.add('active'));
document.addEventListener('mouseup', () => cursor.classList.remove('active'));
// Hide default cursor
document.body.style.cursor = 'none';

// --- Fade-in/Slide-in on Scroll ---
function revealOnScroll() {
    const fadeEls = document.querySelectorAll('.fade-in, .slide-in');
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Dynamically load and display projects
fetch('projects/data.json')
  .then(response => response.json())
  .then(data => {
    const projects = data.projects;
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card fade-in';
      let mediaHtml = '';
      // Show video if exists
      if (project.video) {
        mediaHtml += `<video src="${project.video}" controls poster="${project.image || (project.images && project.images[0])}" class="project-video"></video>`;
      }
      // Show image slider below the video if images exist
      if (project.images && project.images.length > 0) {
        const sliderId = `slider-${idx}`;
        if (project.images.length === 1) {
          mediaHtml += `
            <div class="project-slider" id="${sliderId}">
              <img src="${project.images[0]}" class="project-slider-img" alt="${project.title} Screenshot">
            </div>
          `;
        } else {
          mediaHtml += `
            <div class="project-slider" id="${sliderId}">
              <button class="slider-btn slider-btn-left" aria-label="Previous image">&#8592;</button>
              <img src="${project.images[0]}" class="project-slider-img" alt="${project.title} Screenshot">
              <button class="slider-btn slider-btn-right" aria-label="Next image">&#8594;</button>
            </div>
          `;
        }
      } else if (project.image && !project.video) {
        // Only show single image if no video and no images array
        mediaHtml += `<img src="${project.image}" alt="${project.title} Screenshot" class="project-thumb">`;
      }
      card.innerHTML = `
        <div class="project-media">
          ${mediaHtml}
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description.replace(/\n/g, '<br>')}</p>
        </div>
      `;
      projectsList.appendChild(card);
      // UI sound on hover/click
      card.addEventListener('mouseenter', playClickSound);
      card.addEventListener('click', playClickSound);
    });

    // Add slider functionality
    projects.forEach((project, idx) => {
      if (project.images && project.images.length > 1) {
        const slider = document.getElementById(`slider-${idx}`);
        if (!slider) return;
        const img = slider.querySelector('.project-slider-img');
        const leftBtn = slider.querySelector('.slider-btn-left');
        const rightBtn = slider.querySelector('.slider-btn-right');
        let current = 0;
        leftBtn.addEventListener('click', () => {
          playClickSound();
          current = (current - 1 + project.images.length) % project.images.length;
          img.src = project.images[current];
        });
        rightBtn.addEventListener('click', () => {
          playClickSound();
          current = (current + 1) % project.images.length;
          img.src = project.images[current];
        });
      }
    });
  });

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-menu-open');
    navToggle.classList.toggle('nav-toggle-open');
    playClickSound();
  });
}

// Page transitions for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.hash && document.querySelector(this.hash)) {
            e.preventDefault();
            triggerPageTransition(() => {
                location.hash = this.hash;
            });
        }
    });
});
