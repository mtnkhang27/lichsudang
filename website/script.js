function initAnimations() {
    // Scroll Animation Observer section
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Special handling for slide-card elements (part2)
                if (el.classList && el.classList.contains('slide-card')) {
                    el.classList.add('visible');
                    const children = el.querySelectorAll('.text > *');
                    children.forEach((child, i) => {
                        child.style.transitionDelay = (i * 80) + 'ms';
                    });
                } else {
                    el.classList.add('active');
                }
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Include section-specific slide cards and general reveal elements
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, #part2 .slide-card');
    revealElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for Hero on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `scale(${1.1 + scrolled * 0.0005})`;
        }
    });

    // Initialize Slider
    initSlider();
}

function initSlider() {
    // Support multiple slider containers on the page
    const containers = document.querySelectorAll('.slider-container');
    containers.forEach(container => {
        const slides = container.querySelectorAll('.slide');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const dotContainer = container.querySelector('.slider-dots');

        if (!slides.length) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        // Create dots (scoped)
        if (dotContainer) {
            dotContainer.innerHTML = ''; // Clear existing dots to prevent duplication
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                dotContainer.appendChild(dot);
            });
        }

        const dots = container.querySelectorAll('.dot');

        function updateDots(index) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        function goToSlide(index) {
            // Remove active class from current
            slides[currentSlide].classList.remove('active');

            // Update index
            currentSlide = (index + totalSlides) % totalSlides;

            // Add active class to new
            slides[currentSlide].classList.add('active');
            updateDots(currentSlide);
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Event Listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto play (optional, 5 seconds)
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(slideInterval));
            container.addEventListener('mouseleave', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    });
}

// Interactive Detail Logic
function showDetail(id) {
    const detailBox = document.getElementById('difficulty-detail');
    const contentArea = document.getElementById('detail-content-area');
    const sourceData = document.getElementById('data-' + id);

    if (!detailBox || !contentArea || !sourceData) return;

    // Fade out if already open to transition
    if (detailBox.style.display !== 'none') {
        detailBox.classList.remove('animate__fadeIn');
        void detailBox.offsetWidth; // trigger reflow
    }

    contentArea.innerHTML = sourceData.innerHTML;
    detailBox.style.display = 'block';
    detailBox.classList.add('animate__animated', 'animate__fadeIn');
}

function closeDetail() {
    const detailBox = document.getElementById('difficulty-detail');
    if (detailBox) {
        detailBox.style.display = 'none';
        detailBox.classList.remove('animate__animated', 'animate__fadeIn');
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500); // Shorter delay since we already waited for fetch
    }
}
