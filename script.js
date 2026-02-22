
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'movieflix-theme';

function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    enableLightMode();
  } else {
    enableDarkMode();
  }
}


function enableDarkMode() {
  document.body.classList.remove('light-mode');
  themeToggle.textContent = '🌙';
  localStorage.setItem(THEME_KEY, 'dark');
}


function enableLightMode() {
  document.body.classList.add('light-mode');
  themeToggle.textContent = '☀️';
  localStorage.setItem(THEME_KEY, 'light');
}


function toggleTheme() {
  if (document.body.classList.contains('light-mode')) {
    enableDarkMode();
  } else {
    enableLightMode();
  }
}

themeToggle.addEventListener('click', toggleTheme);



const cards = document.querySelectorAll('.card');
const movieData = {
  'witcher': {
    title: 'The Witcher',
    image: 'assets/images/recommended/the-witcher-poster.webp',
    description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
  },
  'stranger-things': {
    title: 'Stranger Things',
    image: 'assets/images/recommended/stranger-things-poster.webp',
    description: 'When a young boy disappears, his friends, family and local police unravel a mystery involving secret government experiments, terrifying supernatural forces and strange happenings in a small town.',
  },
  'dark': {
    title: 'Dark',
    image: 'assets/images/recommended/dark-poster.webp',
    description: 'A family\'s missing child prompts unsettling events in a small northwestern town, where even the disappearance of thirty years ago feels like it happened yesterday.',
  },
  'breakdown': {
    title: 'Breakdown',
    image: 'assets/images/recommended/breakdown-poster.webp',
    description: 'A man stranded in the desert searches for his missing wife, uncovering a dark and dangerous mystery.',
  },
};


function handleCardClick(event) {
  const clickedCard = event.currentTarget;
  const movieId = clickedCard.getAttribute('data-movie');

  cards.forEach(card => card.classList.remove('active'));

  clickedCard.classList.add('active');

  if (movieData[movieId]) {
    updateHeroContent(movieData[movieId]);
  }
}

function updateHeroContent(movie) {
  const heroTitle = document.querySelector('.hero-title');
  const heroDescription = document.querySelector('.hero-description');
  const heroBackground = document.querySelector('.hero-background');

  heroTitle.style.opacity = '0';
  heroDescription.style.opacity = '0';

  setTimeout(() => {
    heroTitle.textContent = movie.title;
    heroDescription.textContent = movie.description;
    if (movie.image && heroBackground) {
      heroBackground.style.backgroundImage = `url('${movie.image}')`;
    }

    heroTitle.style.transition = 'opacity 0.3s ease';
    heroDescription.style.transition = 'opacity 0.3s ease';
    heroTitle.style.opacity = '1';
    heroDescription.style.opacity = '1';
  }, 150);
}

cards.forEach(card => {
  card.addEventListener('click', handleCardClick);
  card.style.transition = 'opacity 0.3s ease';
});


const navLinks = document.querySelectorAll('.nav-link');

function handleNavClick(event) {
  event.preventDefault();

  navLinks.forEach(link => link.classList.remove('active'));

  event.currentTarget.classList.add('active');

  const targetId = event.currentTarget.getAttribute('href');
  const targetSection = document.querySelector(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', handleNavClick);
});

const watchBtn = document.getElementById('watchBtn');
const infoBtn = document.getElementById('infoBtn');
const searchBtn = document.getElementById('searchBtn');
const notifBtn = document.getElementById('notifBtn');
const profileBtn = document.getElementById('profileBtn');

watchBtn.addEventListener('click', () => {
  alert('🎬 Starting playback... This is a demo!');
});


infoBtn.addEventListener('click', () => {
  alert('📖 More information about this movie would be displayed here.');
});

searchBtn.addEventListener('click', () => {
  alert('🔍 Search functionality coming soon!');
});

notifBtn.addEventListener('click', () => {
  alert('🔔 No new notifications');
});

profileBtn.addEventListener('click', () => {
  alert('👤 Profile section coming soon!');
});


function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavOnScroll);

document.addEventListener('keydown', (event) => {
  const activeCard = document.querySelector('.card.active');
  const activeIndex = Array.from(cards).indexOf(activeCard);

  if (event.key === 'ArrowLeft' && activeIndex > 0) {
    cards[activeIndex - 1].click();
  } else if (event.key === 'ArrowRight' && activeIndex < cards.length - 1) {
    cards[activeIndex + 1].click();
  }
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  observer.observe(heroContent);
}

document.addEventListener('DOMContentLoaded', () => {

  initializeTheme();


  if (cards.length > 0) {
    cards[0].classList.add('active');
  }

  console.log('✨ MovieFlix loaded successfully!');
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
    
if (!('scrollBehavior' in document.documentElement.style)) {
  const smoothScroll = debounce(() => {
    window.scrollBy({ top: 5, behavior: 'smooth' });
  }, 10);
}

window.TMDB_API_KEY = window.TMDB_API_KEY || '';

const sampleTrending = [
  {
    id: 1,
    title: 'Dune',
    poster: 'https://m.media-amazon.com/images/I/81s2ZJv1KLL._AC_SY679_.jpg',
    overview: 'Paul Atreides leads nomadic tribes in a fight for control over the desert planet Arrakis.',
    release_date: '2021-10-22'
  },
  {
    id: 2,
    title: 'No Time to Die',
    poster: 'https://m.media-amazon.com/images/I/71K8M2GkWML._AC_SY679_.jpg',
    overview: 'James Bond has left active service. His peace is short-lived when his old friend Felix Leiter arrives.',
    release_date: '2021-10-08'
  },
  {
    id: 3,
    title: 'The Batman',
    poster: 'https://m.media-amazon.com/images/I/91v6m5Z0DkL._AC_SY679_.jpg',
    overview: 'When the Riddler targets Gotham with a series of mysterious crimes, Batman uncovers corruption.',
    release_date: '2022-03-04'
  },
  {
    id: 4,
    title: 'Everything Everywhere All at Once',
    poster: 'https://m.media-amazon.com/images/I/81Ff5uCkG6L._AC_SY679_.jpg',
    overview: 'An exhausted Chinese American woman is swept up in an insane adventure across the multiverse.',
    release_date: '2022-03-25'
  }
];

async function fetchTrendingFromTMDB() {
  if (!window.TMDB_API_KEY) throw new Error('No TMDB API key');
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${window.TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return (data.results || []).map(m => ({
    id: m.id,
    title: m.title || m.name,
    poster: m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : '',
    overview: m.overview,
    release_date: m.release_date || m.first_air_date
  }));
}

function renderTrending(movies) {
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;
  if (!movies || movies.length === 0) {
    grid.innerHTML = '<p class="empty">No trending movies available.</p>';
    return;
  }

  grid.innerHTML = movies
    .map(m => `
      <article class="movie-card" data-id="${m.id}">
        <img src="${m.poster}" alt="${m.title}" />
        <h3>${m.title}</h3>
        <p class="overview">${m.overview || ''}</p>
        <div class="movie-actions"><button class="btn btn-primary watch" data-title="${m.title}">Watch</button></div>
      </article>
    `)
    .join('');

  grid.querySelectorAll('.watch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('▶ Playing (demo): ' + btn.dataset.title);
    });
  });

  grid.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const movieId = card.dataset.id;
      loadRecommended(false, movieId);

      card.classList.add('active');
      setTimeout(() => card.classList.remove('active'), 800);
    });
  });
}

async function loadTrending(useSample = false) {
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading">Loading...</div>';
  try {
    const movies = useSample ? sampleTrending : await fetchTrendingFromTMDB();
    renderTrending(movies);
  } catch (err) {
    renderTrending(sampleTrending);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const refresh = document.getElementById('refreshTrending');
  const sampleBtn = document.getElementById('useSample');

  if (refresh) refresh.addEventListener('click', () => loadTrending(false));
  if (sampleBtn) sampleBtn.addEventListener('click', () => loadTrending(true));


  loadTrending(false);
});


const sampleRecommended = [
  {
    id: 101,
    title: 'Arrival',
    poster: 'https://m.media-amazon.com/images/I/81n1gXf3T7L._AC_SY679_.jpg',
    overview: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    release_date: '2016-11-11'
  },
  {
    id: 102,
    title: 'Interstellar',
    poster: 'https://m.media-amazon.com/images/I/81kz7vX8MQL._AC_SY679_.jpg',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    release_date: '2014-11-07'
  },
  {
    id: 103,
    title: 'Blade Runner 2049',
    poster: 'https://m.media-amazon.com/images/I/71U1YpH6w5L._AC_SY679_.jpg',
    overview: 'A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard.',
    release_date: '2017-10-06'
  },
  {
    id: 104,
    title: 'Mad Max: Fury Road',
    poster: 'https://m.media-amazon.com/images/I/81o5pZxN9ML._AC_SY679_.jpg',
    overview: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.',
    release_date: '2015-05-15'
  }
];

async function fetchRecommendedFromTMDB(movieId = null) {
  if (!window.TMDB_API_KEY) throw new Error('No TMDB API key');
  let url;
  if (movieId) {
    url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${window.TMDB_API_KEY}`;
  } else {
    url = `https://api.themoviedb.org/3/movie/popular?api_key=${window.TMDB_API_KEY}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  const data = await res.json();
  return (data.results || []).map(m => ({
    id: m.id,
    title: m.title || m.name,
    poster: m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : '',
    overview: m.overview,
    release_date: m.release_date || m.first_air_date
  }));
}

function renderRecommended(movies) {
  const grid = document.getElementById('recommendedGrid');
  if (!grid) return;
  if (!movies || movies.length === 0) {
    grid.innerHTML = '<p class="empty">No recommendations available.</p>';
    return;
  }

  grid.innerHTML = movies
    .map(m => `
      <article class="movie-card" data-id="${m.id}">
        <img src="${m.poster}" alt="${m.title}" />
        <h3>${m.title}</h3>
        <p class="overview">${m.overview || ''}</p>
        <div class="movie-actions"><button class="btn btn-primary watch" data-title="${m.title}">Watch</button></div>
      </article>
    `)
    .join('');

  grid.querySelectorAll('.watch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('▶ Playing (demo): ' + btn.dataset.title);
    });
  });
}

async function loadRecommended(useSample = false, movieId = null) {
  const grid = document.getElementById('recommendedGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading">Loading recommendations...</div>';
  try {
    const movies = useSample ? sampleRecommended : await fetchRecommendedFromTMDB(movieId);
    renderRecommended(movies);
  } catch (err) {
    renderRecommended(sampleRecommended);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const refreshRec = document.getElementById('refreshRecommended');
  const sampleRec = document.getElementById('useSampleRecommended');

  if (refreshRec) refreshRec.addEventListener('click', () => loadRecommended(false));
  if (sampleRec) sampleRec.addEventListener('click', () => loadRecommended(true));

  loadRecommended(false);
});
