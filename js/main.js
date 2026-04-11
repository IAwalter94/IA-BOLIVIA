/* ============================================
   AI BolivIA SRL — Main JavaScript
   - Real form submission via FormSubmit.co
   - Functional buttons & navigation
   - Animated counters, scroll reveal, mobile menu
   ============================================ */

(function () {
  'use strict';

  /* --- DOM references --- */
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');
  var submitText = document.getElementById('submitText');
  var submitSpinner = document.getElementById('submitSpinner');
  var allNavLinks = document.querySelectorAll('.nav-link');
  var reveals = document.querySelectorAll('.reveal');
  var statNumbers = document.querySelectorAll('.stat__number[data-target]');

  /* --- Navbar scroll effect --- */
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  /* --- Mobile menu toggle --- */
  function toggleMenu() {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  }

  function closeMenu() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }

  navToggle.addEventListener('click', toggleMenu);

  allNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* --- Close menu on outside click --- */
  document.addEventListener('click', function (e) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* --- Active nav link based on scroll --- */
  function updateActiveLink() {
    var sections = document.querySelectorAll('section[id]');
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allNavLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* --- Scroll reveal (Intersection Observer) --- */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* --- Animated counters --- */
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  var statsSection = document.querySelector('.hero__stats');
  if (statsSection) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  /* --- Contact form: real submission via fetch to FormSubmit.co --- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Client-side validation */
      var nombre = document.getElementById('nombre');
      var email = document.getElementById('email');
      var mensaje = document.getElementById('mensaje');
      var valid = true;

      [nombre, email, mensaje].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#EF4444';
        valid = false;
      }

      if (!valid) return;

      /* Show loading state */
      submitText.textContent = 'Enviando...';
      submitSpinner.classList.remove('hidden');
      submitBtn.disabled = true;

      /* Send via fetch (AJAX) so user stays on the page */
      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          formSuccess.textContent = '✅ ¡Mensaje enviado con éxito! Te contactaremos pronto.';
          formSuccess.classList.add('show');
          contactForm.reset();
        } else {
          formSuccess.textContent = '⚠️ Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.';
          formSuccess.style.borderColor = '#EF4444';
          formSuccess.style.color = '#EF4444';
          formSuccess.classList.add('show');
        }
      })
      .catch(function () {
        formSuccess.textContent = '⚠️ Error de conexión. Intenta de nuevo o escríbenos por WhatsApp.';
        formSuccess.style.borderColor = '#EF4444';
        formSuccess.style.color = '#EF4444';
        formSuccess.classList.add('show');
      })
      .finally(function () {
        submitText.textContent = 'Enviar Mensaje';
        submitSpinner.classList.add('hidden');
        submitBtn.disabled = false;

        setTimeout(function () {
          formSuccess.classList.remove('show');
          formSuccess.style.borderColor = '';
          formSuccess.style.color = '';
        }, 6000);
      });
    });

    /* Clear error styles on input */
    var formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  /* --- Smooth scroll for all anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --- Event listeners --- */
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', function () {
    handleScroll();
    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });
})();
