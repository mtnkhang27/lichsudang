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
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
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

    // Initialize Collapsible Timeline
    initCollapsibleTimeline();

    // Initialize Timeline Stepper
    initTimelineStepper();

    // Initialize Horizontal Timeline (new)
    initHorizontalTimeline();
}

// Horizontal Timeline - Click to expand cards
function initHorizontalTimeline() {
    const timelineContainer = document.querySelector('.horizontal-timeline');
    if (!timelineContainer) return;

    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.timeline-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'timeline-overlay';
        document.body.appendChild(overlay);
    }

    // Add close buttons to all cards
    const cards = document.querySelectorAll('.horizontal-timeline .timeline-card');
    cards.forEach(card => {
        if (!card.querySelector('.card-close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'card-close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeExpandedCard();
            });
            card.appendChild(closeBtn);
        }
    });

    // Click on timeline items to expand
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const card = this.querySelector('.timeline-card');
            if (!card) return;

            // If already expanded, close it
            if (card.classList.contains('expanded')) {
                closeExpandedCard();
                return;
            }

            // Close any other expanded cards first
            closeExpandedCard();

            // Get the node color for styling
            const node = this.querySelector('.timeline-node');
            const nodeColor = node ? getComputedStyle(node).getPropertyValue('--node-color').trim() : '#E57373';

            // Expand this card
            card.classList.add('expanded');
            card.style.setProperty('--node-color', nodeColor);
            card.style.borderColor = nodeColor;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Click on overlay to close
    overlay.addEventListener('click', closeExpandedCard);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeExpandedCard();
        }
    });

    function closeExpandedCard() {
        const expandedCard = document.querySelector('.horizontal-timeline .timeline-card.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
            expandedCard.style.borderColor = '';
        }
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Collapsible Timeline Toggle
function initCollapsibleTimeline() {
    document.querySelectorAll('.timeline-header').forEach(header => {
        header.addEventListener('click', function () {
            const content = this.closest('.collapsible-timeline');
            if (content) {
                content.classList.toggle('expanded');
            }
        });
    });
}

// Timeline Stepper Navigation
let currentTimelineSlide = 0;
const totalTimelineSlides = 2;

function updateTimelineStepper() {
    const slides = document.querySelectorAll('.timeline-slide');
    const dots = document.querySelectorAll('.step-dot');
    const lines = document.querySelectorAll('.step-line');
    const counter = document.querySelector('.slide-counter');
    const prevBtn = document.querySelector('.stepper-nav .prev-btn');
    const nextBtn = document.querySelector('.stepper-nav .next-btn');

    if (!slides.length) return;

    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'exit-left');
        if (index === currentTimelineSlide) {
            slide.classList.add('active');
        } else if (index < currentTimelineSlide) {
            slide.classList.add('exit-left');
        }
    });

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index === currentTimelineSlide) {
            dot.classList.add('active');
        } else if (index < currentTimelineSlide) {
            dot.classList.add('completed');
        }
    });

    // Update lines
    lines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index < currentTimelineSlide) {
            line.classList.add('completed');
        }
    });

    // Update counter
    if (counter) {
        counter.textContent = `${currentTimelineSlide + 1} / ${totalTimelineSlides}`;
    }

    // Update buttons
    if (prevBtn) prevBtn.disabled = currentTimelineSlide === 0;
    if (nextBtn) {
        if (currentTimelineSlide === totalTimelineSlides - 1) {
            nextBtn.textContent = 'Hoàn thành ✓';
            nextBtn.style.background = '#2E7D32';
        } else {
            nextBtn.textContent = 'Tiếp theo →';
            nextBtn.style.background = '';
        }
    }
}

function nextTimelineSlide() {
    if (currentTimelineSlide < totalTimelineSlides - 1) {
        currentTimelineSlide++;
        updateTimelineStepper();
    }
}

function prevTimelineSlide() {
    if (currentTimelineSlide > 0) {
        currentTimelineSlide--;
        updateTimelineStepper();
    }
}

// Initialize stepper dots click and expand buttons
function initTimelineStepper() {
    // Dot navigation
    document.querySelectorAll('.step-dot').forEach(dot => {
        dot.addEventListener('click', function () {
            const step = parseInt(this.dataset.step);
            if (!isNaN(step)) {
                currentTimelineSlide = step;
                updateTimelineStepper();
            }
        });
    });

    // Expand buttons
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.expandable-card');
            if (card) {
                card.classList.toggle('expanded');
                this.textContent = card.classList.contains('expanded') ? 'Thu gọn' : 'Xem chi tiết';
            }
        });
    });

    // Nav buttons
    const prevBtn = document.querySelector('.stepper-nav .prev-btn');
    const nextBtn = document.querySelector('.stepper-nav .next-btn');
    if (prevBtn) prevBtn.addEventListener('click', prevTimelineSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextTimelineSlide);
}

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotContainer = document.querySelector('.slider-dots');

    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Create dots
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

    const dots = document.querySelectorAll('.dot');

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
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
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
