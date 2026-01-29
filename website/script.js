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
                // Close mobile menu after clicking a link
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
                    document.body.style.overflow = '';
                }
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

    // Initialize Mobile Menu
    initMobileMenu();

    // Initialize Timeline Popup (Part 3)
    initTimelinePopup();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
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

// --- Helper Functions (Moved to global scope) ---

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

// --- Timeline Popup Initialization ---

function initTimelinePopup() {
    const timelineData = [{
        title: "Hòa Tưởng - Đánh Pháp",
        date: "9/1945 - 6/3/1946",
        image: "./images/hinh_anh_quoc_hoi_1.jpg",
        sections: [{
            title: "🏛️ Chính trị",
            items: [
                "Nhường 70 ghế Quốc hội cho Việt Quốc, Việt Cách",
                "Giao một số chức vụ quan trọng: Phó Chủ tịch nước, Bộ trưởng...",
                "Đảng Cộng sản tuyên bố \"tự giải tán\", thực chất rút vào bí mật"
            ]
        },
        {
            title: "💰 Kinh tế",
            items: [
                "Cung cấp lương thực, thực phẩm cho quân đội Tưởng",
                "Chấp nhận tiền \"Quan kim\", \"Quốc tệ\" mất giá lưu hành"
            ]
        }
        ],
        result: "✅ Làm thất bại âm mưu lật đổ chính quyền, tập trung kháng Pháp ở miền Nam"
    },
    {
        title: "Hiệp ước Hoa-Pháp",
        date: "28/2/1946",
        image: "./images/hiep_uoc_hoa_phap.jpg",
        sections: [{
            title: "⚡ Nội dung hiệp ước",
            items: [
                "Tưởng đồng ý cho Pháp đưa quân ra Bắc thay thế quân Tưởng",
                "Pháp và Tưởng trở thành đồng minh"
            ]
        },
        {
            title: "🤔 Hai sự lựa chọn",
            items: [
                "<strong>Lựa chọn 1:</strong> Cầm súng chống Pháp ngay lập tức",
                "<strong>Lựa chọn 2:</strong> Hòa hoãn với Pháp để đuổi quân Tưởng về nước"
            ]
        }
        ],
        result: "⚠️ Ban Thường vụ Trung ương Đảng họp → chọn giải pháp \"Hòa để tiến\""
    },
    {
        title: "Hiệp định Sơ bộ",
        date: "6/3/1946",
        image: "./images/hiep_dinh_so_bo_1.png",
        sections: [{
            title: "📋 Nội dung cơ bản",
            items: [
                "Pháp công nhận VN là <strong>\"Quốc gia tự do\" (Free State)</strong>",
                "VN có chính phủ, nghị viện, quân đội và tài chính riêng",
                "Nằm trong Liên bang Đông Dương và Liên hiệp Pháp"
            ]
        },
        {
            title: "🤝 Thỏa thuận quân sự",
            items: [
                "VN đồng ý cho <strong>15.000 quân Pháp</strong> ra Bắc thay quân Tưởng",
                "Quân Pháp sẽ rút dần trong thời hạn <strong>5 năm</strong>",
                "Hai bên thực hiện <strong>ngừng bắn ở Nam Bộ</strong>"
            ]
        }
        ],
        result: "✅ Loại bỏ 20 vạn quân Tưởng không tốn một viên đạn, tránh \"lưỡng đầu thọ địch\""
    },
    {
        title: "Tạm ước 14/9",
        date: "14/9/1946",
        image: "./images/tam_uoc_1946.jpg",
        sections: [{
            title: "❌ Bối cảnh",
            items: [
                "Đàm phán tại <strong>Fontainebleau (Pháp)</strong> thất bại",
                "Nguyên nhân: Lập trường hiếu chiến của thực dân Pháp",
                "Quan hệ Việt-Pháp ngày càng căng thẳng"
            ]
        },
        {
            title: "📝 Nội dung Tạm ước",
            items: [
                "Hồ Chí Minh ký với Chính phủ Pháp",
                "Nhân nhượng thêm về <strong>kinh tế và văn hóa</strong>",
                "Mục đích: Có thêm thời gian hòa bình chuẩn bị kháng chiến"
            ]
        }
        ],
        result: "✅ Kéo dài thời gian hòa hoãn quý báu, củng cố lực lượng mọi mặt"
    },
    {
        title: "Toàn quốc kháng chiến",
        date: "19/12/1946",
        image: "./images/toan_quoc_khang_chien.jpg",
        sections: [{
            title: "🏆 Thành quả ngoại giao 1945-1946",
            items: [
                "Đã đuổi được 20 vạn quân Tưởng về nước",
                "Có thời gian củng cố chính quyền, xây dựng lực lượng",
                "Bảo vệ thành quả Cách mạng Tháng Tám"
            ]
        },
        {
            title: "📚 Bài học nghệ thuật ngoại giao",
            items: [
                "<strong>\"Dĩ bất biến\":</strong> Kiên quyết giữ độc lập, chủ quyền, toàn vẹn lãnh thổ",
                "<strong>\"Ứng vạn biến\":</strong> Linh hoạt ứng xử từng kẻ thù, \"thêm bạn bớt thù\"",
                "Biết nhân nhượng đúng lúc, đúng chỗ để bảo toàn lực lượng"
            ]
        }
        ],
        result: "🎖️ Chính quyền non trẻ vượt qua tình thế hiểm nghèo - Thành công!"
    }
    ];

    const popup = document.getElementById('timelinePopup');
    const popupBody = document.getElementById('popupBody');

    if (!popup || !popupBody) {
        console.log('Timeline popup elements not found');
        return;
    }

    const closeBtn = popup.querySelector('.popup-close-btn');
    const timelineCards = document.querySelectorAll('.vertical-timeline .timeline-card');

    console.log('✅ Timeline pop initialization - Cards found:', timelineCards.length);

    timelineCards.forEach((card, index) => {
        card.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log('✅ Card clicked:', index);

            const data = timelineData[index];
            if (!data) return;

            // Update popup image
            const popupImageWrapper = popup.querySelector('.popup-image-wrapper');
            if (data.image) {
                popupImageWrapper.innerHTML = '<img src="' + data.image + '" alt="' + data.title + '" style="width: 100%; height: 200px; object-fit: cover;">';
            } else {
                popupImageWrapper.innerHTML = '<div class="popup-image placeholder"><span class="placeholder-text">📷 Hình ảnh chi tiết</span></div>';
            }

            let html = '<h3>' + data.title + '</h3><span class="popup-date">' + data.date + '</span>';

            data.sections.forEach(section => {
                html += '<div class="popup-section"><h5>' + section.title + '</h5><ul>';
                section.items.forEach(item => {
                    html += '<li>' + item + '</li>';
                });
                html += '</ul></div>';
            });

            html += '<div class="popup-result">' + data.result + '</div>';

            popupBody.innerHTML = html;
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}