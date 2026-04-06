async function loadClients() {
  try {
    const response = await fetch('/data/clients.json');
    const clients = await response.json();

    const clientsGrid = document.getElementById('clientsGrid');

    if (!clientsGrid) return;

    clients.forEach(client => {
      const clientCard = document.createElement('div');
      clientCard.className = 'client-card reveal';

      const impactList = client.impact.map(item => `<li>${item}</li>`).join('');
      
      // Support both old 'image' field and new 'images' array for backwards compatibility
      const images = client.images || (client.image ? [client.image] : []);
      
      // Show only the first image in the card
      const firstImage = images[0];
      const remainingCount = images.length - 1;
      const badgeHTML = remainingCount > 0 ? `<div class="image-badge">+${remainingCount}</div>` : '';
      
      const imageHTML = firstImage ? `
        <div class="image-container">
          <img 
            src="/img/${firstImage}" 
            alt="${client.name}" 
            class="client-image" 
            data-all-images='${JSON.stringify(images)}'
            data-client-name="${client.name}"
          >
          ${badgeHTML}
        </div>
      ` : '';

      clientCard.innerHTML = `
        <div class="client-header">
          <h3 class="client-name">${client.name}</h3>
          <p class="client-handle">${client.handle}</p>
        </div>
        <span class="client-role">${client.role}</span>
        <p class="client-description">${client.description}</p>
        <div class="client-impact">
          <h4>Impact</h4>
          <ul>
            ${impactList}
          </ul>
        </div>
        <div class="client-media">
          ${imageHTML}
        </div>
      `;

      clientsGrid.appendChild(clientCard);
    });

    // Add click handler for lightbox
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('client-image')) {
        const allImages = JSON.parse(e.target.dataset.allImages);
        const clientName = e.target.dataset.clientName;
        openLightbox(allImages, clientName, 0);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.client-card').forEach(card => {
      observer.observe(card);
    });

  } catch (error) {
    console.error('Error loading clients:', error);
  }
}

function openLightbox(allImages, clientName, currentIndex = 0) {
  // Remove existing lightbox so we can recreate it cleanly for each client
  const existing = document.getElementById('imageLightbox');
  if (existing) {
    existing.remove();
  }

  const lightbox = document.createElement('div');
  lightbox.id = 'imageLightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" id="lightboxClose">&times;</button>
      ${allImages.length > 1 ? `
        <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
        <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
        <div class="image-counter" id="imageCounter"></div>
      ` : ''}
      <div class="lightbox-gallery" id="lightboxGallery"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Store current state
  lightbox.dataset.allImages = JSON.stringify(allImages);
  lightbox.dataset.currentIndex = currentIndex;
  lightbox.dataset.totalImages = allImages.length;

  // Display current image
  displayImage(currentIndex, allImages);
  lightbox.classList.add('active');

  // Close button handler
  const closeBtn = document.getElementById('lightboxClose');
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeLightbox();
  };

  // Close on overlay or outer lightbox click
  const overlay = lightbox.querySelector('.lightbox-overlay');
  overlay.onclick = () => {
    closeLightbox();
  };

  lightbox.onclick = (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  };

  // Navigation buttons (if multiple images)
  if (allImages.length > 1) {
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    prevBtn.onclick = (e) => {
      e.stopPropagation();
      navigateImage(-1, allImages, lightbox);
    };

    nextBtn.onclick = (e) => {
      e.stopPropagation();
      navigateImage(1, allImages, lightbox);
    };

    // Swipe detection
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(touchStartX, touchEndX, allImages, lightbox);
    }, false);
  }

  // Keyboard navigation
  document.removeEventListener('keydown', handleLightboxKeydown);
  document.addEventListener('keydown', handleLightboxKeydown);
}

function displayImage(index, allImages) {
  const lightbox = document.getElementById('imageLightbox');
  const gallery = document.getElementById('lightboxGallery');
  
  gallery.innerHTML = `<img src="/img/${allImages[index]}" alt="Image ${index + 1}" class="gallery-image fullscreen-image">`;
  
  // Update counter
  const counter = document.getElementById('imageCounter');
  if (counter) {
    counter.textContent = `${index + 1} / ${allImages.length}`;
  }

  lightbox.dataset.currentIndex = index;
}

function navigateImage(direction, allImages, lightbox) {
  let currentIndex = parseInt(lightbox.dataset.currentIndex);
  currentIndex += direction;

  // Wrap around
  if (currentIndex < 0) {
    currentIndex = allImages.length - 1;
  } else if (currentIndex >= allImages.length) {
    currentIndex = 0;
  }

  displayImage(currentIndex, allImages);
}

function handleSwipe(startX, endX, allImages, lightbox) {
  const threshold = 50; // minimum distance to trigger swipe
  const diff = startX - endX;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swiped left -> show next image
      navigateImage(1, allImages, lightbox);
    } else {
      // Swiped right -> show previous image
      navigateImage(-1, allImages, lightbox);
    }
  }
}

function handleLightboxKeydown(e) {
  const lightbox = document.getElementById('imageLightbox');
  if (!lightbox || !lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    const allImages = JSON.parse(lightbox.dataset.allImages);
    const prevBtn = document.getElementById('lightboxPrev');
    if (prevBtn) {
      prevBtn.click();
    }
  } else if (e.key === 'ArrowRight') {
    const allImages = JSON.parse(lightbox.dataset.allImages);
    const nextBtn = document.getElementById('lightboxNext');
    if (nextBtn) {
      nextBtn.click();
    }
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', loadClients);
