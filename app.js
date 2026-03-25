/**
 * SSP_Food — Interactive JavaScript
 * Features: Scroll effects, filters, carousels, animations
 * (c) 2026 Shiva Sai Perseverance
 */

document.addEventListener('DOMContentLoaded', () => {

  // ——————————————————————
  // 1. HEADER SCROLL EFFECT
  // ——————————————————————
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 60);
    backToTop.classList.toggle('visible', scrollY > 400);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ——————————————————————
  // 2. MOBILE MENU
  // ——————————————————————
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);

    // Animate hamburger → X
    const spans = menuToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    });
  });

  // ——————————————————————
  // 3. SCROLL REVEAL (Intersection Observer)
  // ——————————————————————
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ——————————————————————
  // 4. CATEGORY CAROUSEL SCROLL
  // ——————————————————————
  const catScroll = document.getElementById('categoriesScroll');
  const catLeft = document.getElementById('catScrollLeft');
  const catRight = document.getElementById('catScrollRight');

  if (catScroll && catLeft && catRight) {
    const scrollAmount = 300;

    catLeft.addEventListener('click', () => {
      catScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    catRight.addEventListener('click', () => {
      catScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ——————————————————————
  // 5. OFFERS CAROUSEL SCROLL
  // ——————————————————————
  const offerScroll = document.getElementById('offersScroll');
  const offerLeft = document.getElementById('offerScrollLeft');
  const offerRight = document.getElementById('offerScrollRight');

  if (offerScroll && offerLeft && offerRight) {
    const scrollAmount = 400;

    offerLeft.addEventListener('click', () => {
      offerScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    offerRight.addEventListener('click', () => {
      offerScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ——————————————————————
  // 6. FILTER PILLS
  // ——————————————————————
  const filterPills = document.querySelectorAll('.filter-pill');
  const restaurantCards = document.querySelectorAll('.restaurant-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Remove active from all
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.dataset.filter;

      restaurantCards.forEach(card => {
        const tags = card.dataset.tags || '';
        if (filterValue === 'all' || tags.includes(filterValue)) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ——————————————————————
  // 7. FAVOURITE BUTTON TOGGLE
  // ——————————————————————
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');

      // Heart fill animation
      const svg = btn.querySelector('svg');
      if (btn.classList.contains('liked')) {
        svg.setAttribute('fill', 'currentColor');
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
      } else {
        svg.setAttribute('fill', 'none');
      }
    });
  });

  // ——————————————————————
  // 8. SEARCH FUNCTIONALITY
  // ——————————————————————
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    let searchTimeout;

    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = searchInput.value.trim().toLowerCase();

        restaurantCards.forEach(card => {
          const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
          const cuisines = card.querySelector('.card-cuisines').textContent.toLowerCase();
          const match = !query || name.includes(query) || cuisines.includes(query);

          card.style.display = match ? '' : 'none';
        });

        // Reset filters
        filterPills.forEach(p => p.classList.remove('active'));
        document.querySelector('[data-filter="all"]')?.classList.add('active');
      }, 300);
    });
  }

  // ——————————————————————
  // 9. CATEGORY CLICK → FILTER
  // ——————————————————————
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      const category = item.dataset.category?.toLowerCase() || '';

      // Scroll to restaurants
      document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });

      // Filter restaurants
      setTimeout(() => {
        restaurantCards.forEach(card => {
          const cuisines = card.querySelector('.card-cuisines').textContent.toLowerCase();
          const match = cuisines.includes(category);
          card.style.display = match ? '' : 'none';
        });

        filterPills.forEach(p => p.classList.remove('active'));
      }, 600);
    });
  });

  // ——————————————————————
  // 10. NEWSLETTER SUBSCRIBE (CTA)
  // ——————————————————————
  const ctaEmail = document.getElementById('ctaEmail');
  const ctaSubscribe = document.getElementById('ctaSubscribe');

  if (ctaSubscribe && ctaEmail) {
    ctaSubscribe.addEventListener('click', () => {
      const email = ctaEmail.value.trim();

      if (!email || !email.includes('@')) {
        ctaEmail.style.borderColor = 'var(--rating-red)';
        ctaEmail.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
        ctaEmail.placeholder = 'Please enter a valid email';

        setTimeout(() => {
          ctaEmail.style.borderColor = '';
          ctaEmail.style.boxShadow = '';
          ctaEmail.placeholder = 'Enter your email address';
        }, 2000);
        return;
      }

      // Simulate success
      ctaSubscribe.textContent = '✓ Subscribed!';
      ctaSubscribe.style.background = 'var(--rating-green)';
      ctaEmail.value = '';

      setTimeout(() => {
        ctaSubscribe.textContent = 'Subscribe';
        ctaSubscribe.style.background = '';
      }, 3000);
    });
  }

  // ——————————————————————
  // 11. SMOOTH SCROLL FOR ANCHOR LINKS
  // ——————————————————————
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ——————————————————————
  // 12. COUNTER ANIMATION (Hero Stats)
  // ——————————————————————
  const animateCounter = (el, target, suffix = '') => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, duration / steps);
  };

  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          const text = stat.textContent.trim();
          if (text.includes('k')) {
            animateCounter(stat, 10, 'k+');
          } else if (text.includes('min')) {
            animateCounter(stat, 30, ' min');
          } else {
            animateCounter(stat, 500, '+');
          }
        });
        heroStatsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroStatsObserver.observe(heroStats);

  // ——————————————————————
  // 13. PARTICLE / FLOATING BG DOTS (subtle)
  // ——————————————————————
  const createParticles = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(255, 107, 44, ${Math.random() * 0.15 + 0.05});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        z-index: 0;
      `;
      hero.appendChild(particle);
    }
  };

  createParticles();

  // ——————————————————————
  // 14. CART BADGE (demo counter)
  // ——————————————————————
  let cartCount = 0;
  const cartBadge = document.querySelector('.nav-link .badge');

  document.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', () => {
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.transform = 'scale(1.4)';
        setTimeout(() => { cartBadge.style.transition = 'transform 0.3s ease'; cartBadge.style.transform = 'scale(1)'; }, 200);
      }
    });
  });

  console.log('🍽️ SSP_Food loaded successfully — by Shiva Sai Perseverance');
});
