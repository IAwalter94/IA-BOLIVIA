/* ============================================
   IA BOLIVIA — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* --- DOM references --- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const reveals = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');

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
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

  /* --- Contact form handling --- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple client-side validation
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

      // Basic email pattern check
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#EF4444';
        valid = false;
      }

      if (!valid) return;

      // Simulate form submission
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      setTimeout(function () {
        formSuccess.classList.add('show');
        contactForm.reset();
        submitBtn.textContent = 'Enviar Mensaje';
        submitBtn.disabled = false;

        setTimeout(function () {
          formSuccess.classList.remove('show');
        }, 5000);
      }, 1200);
    });

    // Clear error styles on input
    var formInputs = contactForm.querySelectorAll('input, textarea');
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
    /* Trigger reveals that are already in viewport on load */
    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });
})();
