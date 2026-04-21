async function loadStories() {
  try {
    const response = await fetch('./data/stories.json');
    const stories = await response.json();

    const storiesGrid = document.getElementById('storiesGrid');

    if (!storiesGrid) return;

    stories.forEach(story => {
      const storyCard = document.createElement('div');
      storyCard.className = 'story-card reveal';

      storyCard.innerHTML = `
        <p class="story-text">"${story.text}"</p>
        <p class="story-client">— ${story.client}</p>
      `;

      storiesGrid.appendChild(storyCard);
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

    document.querySelectorAll('.story-card').forEach(card => {
      observer.observe(card);
    });

  } catch (error) {
    console.error('Error loading stories:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadStories);
