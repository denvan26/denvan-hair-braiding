/* ============================================
   DENVAN HAIR BRAIDING - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Sticky Navigation ----------
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ---------- Mobile Menu Toggle ----------
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Active Navigation Link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Scroll Animations ----------
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // ---------- Gallery Filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('.style-card, .gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterableCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // ---------- Lightbox ----------
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(imgSrc, imgAlt, styleName) {
    if (!lightbox) return;
    const waMsg = encodeURIComponent(`Hi Denvan! I'd love to get this style: "${styleName}". Can I book an appointment?`);
    const waLink = `https://wa.me/12024159373?text=${waMsg}`;
    lightboxContent.innerHTML = `
      <div class="protected-image">
        <img src="${imgSrc}" alt="${imgAlt}">
        <div class="watermark"></div>
      </div>
      <div class="lightbox-caption">${styleName}</div>
      <div class="lightbox-actions">
        <a href="${waLink}" target="_blank" rel="noopener" class="btn-send">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.332 22.616c-.39 1.1-1.932 2.012-3.182 2.278-.856.18-1.974.324-5.736-1.232-4.812-1.99-7.904-6.878-8.142-7.196-.228-.318-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.39-.428.912-.536 1.218-.536.15 0 .284.008.406.014.432.018.648.044.932.722.356.85 1.22 2.978 1.328 3.196.11.218.218.51.072.808-.136.306-.258.442-.476.694-.218.252-.424.446-.642.718-.2.236-.424.49-.176.932.248.442 1.104 1.82 2.37 2.95 1.632 1.454 3.006 1.904 3.434 2.114.428.21.678.176.926-.106.256-.292 1.096-1.274 1.388-1.712.284-.438.576-.364.968-.218.396.142 2.516 1.188 2.946 1.404.43.218.716.324.822.506.104.18.104 1.054-.286 2.154z"/></svg>
          Send This Style
        </a>
      </div>
    `;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Style card images (styles.html)
  document.querySelectorAll('.style-card-image').forEach(img => {
    img.addEventListener('click', () => {
      const realImg = img.querySelector('img');
      const placeholder = img.querySelector('.img-placeholder');
      const styleName = img.closest('.style-card').querySelector('h3')?.textContent || '';
      if (realImg) {
        openLightbox(realImg.src, realImg.alt, styleName);
      } else if (placeholder) {
        // Fallback for placeholder images
        const clone = placeholder.cloneNode(true);
        if (lightboxContent) {
          lightboxContent.innerHTML = '';
          lightboxContent.appendChild(clone);
          const caption = document.createElement('div');
          caption.className = 'lightbox-caption';
          caption.textContent = styleName;
          lightboxContent.appendChild(caption);
        }
        if (lightbox) {
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  // Gallery card images (gallery.html) - view button
  document.querySelectorAll('.gallery-card-image .btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.gallery-card');
      const realImg = card.querySelector('img');
      const styleName = card.querySelector('h4')?.textContent || '';
      if (realImg) {
        openLightbox(realImg.src, realImg.alt, styleName);
      }
    });
  });

  // Also open lightbox when clicking the gallery card image area
  document.querySelectorAll('.gallery-card-image').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-send') || e.target.closest('.btn-view')) return;
      const card = el.closest('.gallery-card');
      const realImg = card.querySelector('img');
      const styleName = card.querySelector('h4')?.textContent || '';
      if (realImg) {
        openLightbox(realImg.src, realImg.alt, styleName);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- Booking Form Validation ----------
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      bookingForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Required fields
      const requiredFields = bookingForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
      });

      // Email validation
      const email = bookingForm.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        isValid = false;
      }

      // Phone validation
      const phone = bookingForm.querySelector('input[type="tel"]');
      if (phone && phone.value && !/^[\d\s\-\(\)\+]{10,}$/.test(phone.value)) {
        phone.classList.add('error');
        isValid = false;
      }

      // Date validation - must be in the future
      const dateInput = bookingForm.querySelector('input[type="date"]');
      if (dateInput && dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          dateInput.classList.add('error');
          isValid = false;
        }
      }

      if (isValid) {
        // Submit via FormSubmit.co (native form submission)
        bookingForm.submit();
      } else {
        // Scroll to first error
        const firstError = bookingForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Clear error state on input
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
      });
    });

    // Set minimum date to tomorrow
    const dateInput = bookingForm.querySelector('input[type="date"]');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }
  }

  // ---------- File Upload Display ----------
  const fileInput = document.querySelector('.file-upload input[type="file"]');
  const fileNameDisplay = document.querySelector('.file-upload .file-name');

  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
      } else {
        fileNameDisplay.textContent = '';
      }
    });
  }

  // ---------- Contact Form ----------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      const requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
      });

      const email = contactForm.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Submit via FormSubmit.co (native form submission)
        contactForm.submit();
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  // ---------- Show Success on Redirect Back ----------
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const form = document.getElementById('booking-form') || document.getElementById('contact-form');
    const successMsg = document.querySelector('.form-success');
    if (form) form.style.display = 'none';
    if (successMsg) successMsg.classList.add('show');
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Toast Notification Helper ----------
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ---------- Image Protection ----------
  // Block right-click on images and protected containers
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.protected-image') || e.target.closest('.gallery-card-image') ||
        e.target.closest('.watermark') || e.target.tagName === 'IMG') {
      e.preventDefault();
      showToast('Images are protected. Use "Send This Style" to share!');
    }
  });

  // Disable dragging on all images
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Block Ctrl+S, Ctrl+P, and PrintScreen
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      showToast('Saving is disabled on this site.');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      showToast('Printing is disabled to protect our images.');
    }
    if (e.key === 'PrintScreen') {
      showToast('Screenshots are discouraged. Use "Send This Style" to share!');
    }
  });

  // ---------- Subscribe Form ----------
  const subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      if (emailInput && !emailInput.value.trim()) {
        e.preventDefault();
        emailInput.focus();
        return;
      }
    });
  }

  // Show subscribe success from redirect
  if (urlParams.get('subscribed') === 'true') {
    const subSuccess = document.querySelector('.subscribe-success');
    const subForm = document.getElementById('subscribe-form');
    if (subSuccess) subSuccess.classList.add('show');
    if (subForm) subForm.style.display = 'none';
    window.history.replaceState({}, '', window.location.pathname);
  }

});
