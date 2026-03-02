/**
 * Refugio Andino Alausí - Main JavaScript
 * Handles: Navigation, Hero Slider, Lightbox, Accordion, Form Validation, Animations
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Create overlay element for mobile menu
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    function openMenu() {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('open');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (navMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('hero-dots');
    let currentSlide = 0;
    let slideInterval = null;

    // Create dots
    slides.forEach(function (_, index) {
        var dot = document.createElement('button');
        dot.className = 'hero-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir a imagen ' + (index + 1));
        dot.addEventListener('click', function () {
            goToSlide(index);
            resetSlideTimer();
        });
        dotsContainer.appendChild(dot);
    });

    var dots = document.querySelectorAll('.hero-dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        var next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startSlideTimer() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlideTimer() {
        clearInterval(slideInterval);
        startSlideTimer();
    }

    if (slides.length > 1) {
        startSlideTimer();
    }

    // ===== LIGHTBOX =====
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var galleryItems = document.querySelectorAll('.gallery-item');
    var currentLightboxIndex = 0;

    var galleryImages = [];
    galleryItems.forEach(function (item) {
        var img = item.querySelector('img');
        var caption = item.querySelector('.gallery-caption');
        galleryImages.push({
            src: img ? img.src : '',
            alt: img ? img.alt : '',
            caption: caption ? caption.textContent : ''
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        var data = galleryImages[index];
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxCaption.textContent = data.caption;
        lightbox.removeAttribute('hidden');

        // Force reflow then add class
        void lightbox.offsetWidth;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Handle image load error
        lightboxImg.onerror = function () {
            closeLightbox();
            showToast('No se pudo cargar la imagen. Intenta de nuevo.');
        };
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(function () {
            lightbox.setAttribute('hidden', '');
            lightboxImg.src = '';
            lightboxImg.onerror = null;
        }, 300);
    }

    function prevLightbox() {
        var newIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(newIndex);
    }

    function nextLightbox() {
        var newIndex = (currentLightboxIndex + 1) % galleryImages.length;
        openLightbox(newIndex);
    }

    // Gallery item click handlers
    galleryItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            openLightbox(index);
        });
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Ver imagen: ' + (galleryImages[index].caption || 'Galería'));
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
    });

    lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        prevLightbox();
    });

    lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        nextLightbox();
    });

    // Close on background click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevLightbox();
        } else if (e.key === 'ArrowRight') {
            nextLightbox();
        }
    });

    // Touch support for lightbox swipe
    var touchStartX = 0;
    var touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextLightbox();
            } else {
                prevLightbox();
            }
        }
    }, { passive: true });

    // ===== ACCORDION =====
    var accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var body = this.nextElementSibling;
            var isOpen = this.getAttribute('aria-expanded') === 'true';

            // Close all others
            accordionHeaders.forEach(function (otherHeader) {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    var otherBody = otherHeader.nextElementSibling;
                    otherBody.classList.remove('open');
                    otherBody.setAttribute('hidden', '');
                }
            });

            // Toggle current
            if (isOpen) {
                this.setAttribute('aria-expanded', 'false');
                body.classList.remove('open');
                body.setAttribute('hidden', '');
            } else {
                this.setAttribute('aria-expanded', 'true');
                body.removeAttribute('hidden');
                // Force reflow
                void body.offsetWidth;
                body.classList.add('open');
            }
        });
    });

    // ===== FORM VALIDATION & WHATSAPP =====
    var form = document.getElementById('reservas-form');

    // Set min date to today
    var today = new Date().toISOString().split('T')[0];
    var fechaLlegada = document.getElementById('fecha-llegada');
    var fechaSalida = document.getElementById('fecha-salida');
    fechaLlegada.setAttribute('min', today);
    fechaSalida.setAttribute('min', today);

    // Update salida min when llegada changes
    fechaLlegada.addEventListener('change', function () {
        if (this.value) {
            fechaSalida.setAttribute('min', this.value);
            // If salida is before llegada, clear it
            if (fechaSalida.value && fechaSalida.value < this.value) {
                fechaSalida.value = '';
            }
        }
    });

    function showFieldError(fieldId, message) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(fieldId + '-error');
        if (field) field.classList.add('error');
        if (errorEl) errorEl.textContent = message;
    }

    function clearFieldError(fieldId) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(fieldId + '-error');
        if (field) field.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    }

    function clearAllErrors() {
        var fields = ['nombre', 'fecha-llegada', 'fecha-salida', 'tipo', 'personas'];
        fields.forEach(clearFieldError);
    }

    // Clear error on input
    ['nombre', 'fecha-llegada', 'fecha-salida', 'tipo', 'personas'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function () { clearFieldError(id); });
            el.addEventListener('change', function () { clearFieldError(id); });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearAllErrors();

        var nombre = document.getElementById('nombre').value.trim();
        var llegada = fechaLlegada.value;
        var salida = fechaSalida.value;
        var tipo = document.getElementById('tipo').value;
        var personas = document.getElementById('personas').value;
        var mascotas = document.getElementById('mascotas').value;
        var mensaje = document.getElementById('mensaje').value.trim();

        var valid = true;

        if (!nombre) {
            showFieldError('nombre', 'Por favor ingresa tu nombre');
            valid = false;
        }

        if (!llegada) {
            showFieldError('fecha-llegada', 'Selecciona la fecha de llegada');
            valid = false;
        }

        if (!salida) {
            showFieldError('fecha-salida', 'Selecciona la fecha de salida');
            valid = false;
        }

        if (llegada && salida && salida < llegada) {
            showFieldError('fecha-salida', 'La salida no puede ser anterior a la llegada');
            valid = false;
        }

        if (llegada && salida && salida === llegada) {
            showFieldError('fecha-salida', 'La salida debe ser al menos un día después');
            valid = false;
        }

        if (!tipo) {
            showFieldError('tipo', 'Selecciona el tipo de experiencia');
            valid = false;
        }

        if (!personas) {
            showFieldError('personas', 'Selecciona el número de personas');
            valid = false;
        }

        if (!valid) return;

        // Build WhatsApp message
        var waMessage = '¡Hola! Me gustaría hacer una reserva en Refugio Andino Alausí.\n\n';
        waMessage += '📋 *Datos de la reserva:*\n';
        waMessage += '• *Nombre:* ' + nombre + '\n';
        waMessage += '• *Llegada:* ' + formatDate(llegada) + '\n';
        waMessage += '• *Salida:* ' + formatDate(salida) + '\n';
        waMessage += '• *Tipo:* ' + tipo + '\n';
        waMessage += '• *Personas:* ' + personas + '\n';
        waMessage += '• *Mascotas:* ' + mascotas + '\n';

        if (mensaje) {
            waMessage += '\n💬 *Mensaje:* ' + mensaje + '\n';
        }

        waMessage += '\n¡Gracias!';

        var waUrl = 'https://wa.me/593939974271?text=' + encodeURIComponent(waMessage);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    });

    function formatDate(dateStr) {
        if (!dateStr) return '';
        var parts = dateStr.split('-');
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    // ===== SCROLL ANIMATIONS =====
    var fadeElements = document.querySelectorAll(
        '.plan-card, .tarifa-card, .gallery-item, .detail-grid, .accordion-item, .ubicacion-grid, .reservas-grid'
    );

    fadeElements.forEach(function (el) {
        el.classList.add('fade-in');
    });

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== TOAST NOTIFICATION =====
    function showToast(message) {
        // Remove existing toast
        var existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        document.body.appendChild(toast);

        // Show
        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        // Auto-hide
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    var sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
});