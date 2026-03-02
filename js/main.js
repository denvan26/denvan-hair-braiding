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
  const styleCards = document.querySelectorAll('.style-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      styleCards.forEach(card => {
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

  document.querySelectorAll('.style-card-image').forEach(img => {
    img.addEventListener('click', () => {
      if (!lightbox) return;
      const placeholder = img.querySelector('.img-placeholder');
      const realImg = img.querySelector('img');
      const styleName = img.closest('.style-card').querySelector('h3')?.textContent || '';

      if (realImg) {
        lightboxContent.innerHTML = `
          <img src="${realImg.src}" alt="${realImg.alt}">
          <div class="lightbox-caption">${styleName}</div>
        `;
      } else if (placeholder) {
        const clone = placeholder.cloneNode(true);
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(clone);
        const caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        caption.textContent = styleName;
        lightboxContent.appendChild(caption);
      }

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
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
        // Submit via Formspree
        const formData = new FormData(bookingForm);
        const action = bookingForm.getAttribute('action');

        fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            bookingForm.style.display = 'none';
            document.querySelector('.form-success').classList.add('show');
          } else {
            alert('There was an issue submitting the form. Please try again or contact us directly.');
          }
        })
        .catch(() => {
          alert('There was an issue submitting the form. Please try again or contact us directly.');
        });
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
        const formData = new FormData(contactForm);
        const action = contactForm.getAttribute('action');

        fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            contactForm.style.display = 'none';
            document.querySelector('.form-success').classList.add('show');
          } else {
            alert('There was an issue. Please try again or contact us directly.');
          }
        })
        .catch(() => {
          alert('There was an issue. Please try again or contact us directly.');
        });
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
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

});
