// Main JS for portfolio website
// Add scroll animations and interactivity here

// Dynamically load and display projects
fetch('projects/data.json')
  .then(response => response.json())
  .then(data => {
    const projects = data.projects;
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card';
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
          current = (current - 1 + project.images.length) % project.images.length;
          img.src = project.images[current];
        });
        rightBtn.addEventListener('click', () => {
          current = (current + 1) % project.images.length;
          img.src = project.images[current];
        });
      }
    });
  });
