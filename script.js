// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Constants (matching React constants)
const flavorlists = [
    { name: "Classic Roast", color: "classic", rotation: "rotate-neg" },
    { name: "Hazelnut Blend", color: "hazelnut", rotation: "rotate-pos" },
    { name: "Espresso Intense", color: "espresso", rotation: "rotate-neg" },
    { name: "Caramel Instant", color: "caramel", rotation: "rotate-pos" },
    { name: "Vanilla Instant", color: "vanilla", rotation: "rotate-neg" },
    { name: "Dark Chocolate", color: "chocolate", rotation: "rotate-pos" },
];

const nutrientLists = [
    { label: "Potassium", amount: "245mg" },
    { label: "Calcium", amount: "500mg" },
    { label: "Vitamin A", amount: "176mcg" },
    { label: "Vitamin D", amount: "5mcg" },
    { label: "Iron", amount: "1mg" },
];
const cards = [
    { src: "src/videos/f1.mp4", rotation: -10, translation: -5 },
    { src: "src/videos/f2.mp4", rotation: 4, translation: 0 },
    { src: "src/videos/f3.mp4", rotation: -4, translation: -5 },
    { src: "src/videos/f4.mp4", rotation: 4, translation: 5 },
    { src: "src/videos/f5.mp4", rotation: -10, translation: 0 },
    { src: "src/videos/f6.mp4", rotation: 4, translation: 5 },
    { src: "src/videos/f7.mp4", rotation: -3, translation: 10 }
];



// Helper function to check device type
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
const isTablet = () => window.matchMedia("(max-width: 1024px)").matches;
const isDesktop = () => window.matchMedia("(min-width: 1025px)").matches;

// Custom SplitText implementation (since the GSAP SplitText is a Club plugin)
function splitTextIntoSpans(element, type = "chars") {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return { chars: [], words: [], lines: [] };

    const text = el.textContent;
    const result = { chars: [], words: [], lines: [] };

    if (type.includes("words") || type.includes("chars")) {
        const words = text.split(/\s+/);
        el.innerHTML = '';

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-word';
            wordSpan.style.display = 'inline-block';

            if (type.includes("chars")) {
                word.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'split-char';
                    charSpan.style.display = 'inline-block';
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                    result.chars.push(charSpan);
                });
            } else {
                wordSpan.textContent = word;
            }

            el.appendChild(wordSpan);
            result.words.push(wordSpan);

            // Add space between words
            if (wordIndex < words.length - 1) {
                const space = document.createTextNode(' ');
                el.appendChild(space);
            }
        });
    }

    return result;
}

// Generate dynamic content
function generateFlavors() {
    const container = document.getElementById("flavors-container");
    container.innerHTML = flavorlists.map(flavor => `
        <div class="flavor-card ${flavor.rotation}">
            <img src="/src/images/${flavor.color}-bg.svg" class="bg" />
            <img src="/src/images/${flavor.color}-drink.webp" class="drinks" />
            <img src="/src/images/${flavor.color}-elements.webp" class="elements" />
            <h1>${flavor.name}</h1>
        </div>
    `).join("");

    // Initialize parallax hover effect for flavor cards
    initFlavorParallax();
}

// Parallax hover effect for flavor cards
function initFlavorParallax() {
    const flavorCards = document.querySelectorAll('.flavor-card');

    flavorCards.forEach(card => {
        const drink = card.querySelector('.drinks');
        const elements = card.querySelector('.elements');

        // Movement intensity in pixels
        const moveAmount = 25;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate offset from center (-1 to 1)
            const offsetX = (e.clientX - centerX) / (rect.width / 2);
            const offsetY = (e.clientY - centerY) / (rect.height / 2);

            // Drink moves OPPOSITE to cursor (negative offset)
            if (drink) {
                gsap.to(drink, {
                    x: -offsetX * moveAmount,
                    y: -offsetY * moveAmount,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }

            // Elements move SAME direction as cursor (positive offset)
            if (elements) {
                gsap.to(elements, {
                    x: offsetX * moveAmount,
                    y: offsetY * moveAmount,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            // Reset transforms on mouse leave with smooth animation
            if (drink) {
                gsap.to(drink, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
            if (elements) {
                gsap.to(elements, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    });
}

function generateNutrients() {
    const container = document.getElementById("nutrient-list");
    const listsToShow = isMobile() ? nutrientLists.slice(0, 3) : nutrientLists;

    container.innerHTML = listsToShow.map((nutrient, index) => `
        <div class="nutrient-item">
            <div>
                <p class="label">${nutrient.label}</p>
                <p class="up-to">up to</p>
                <p class="amount">${nutrient.amount}</p>
            </div>
            ${index !== listsToShow.length - 1 ? '<div class="spacer-border"></div>' : ''}
        </div>
    `).join("");
}

function generateTestimonialCards() {
    const container = document.getElementById("testimonial-cards");
    container.innerHTML = cards.map((card, index) => {
        const translateY = card.translation ? `translateY(${card.translation}%)` : '';
        const rotate = `rotate(${card.rotation}deg)`;
        return `
            <div class="vd-card" style="transform: ${translateY} ${rotate};" data-index="${index}">
                <video src="${card.src}" playsinline muted loop></video>
            </div>
        `;
    }).join("");

    // Add hover events for video play/pause
    document.querySelectorAll(".vd-card").forEach((card) => {
        const video = card.querySelector("video");
        card.addEventListener("mouseenter", () => video.play());
        card.addEventListener("mouseleave", () => video.pause());
    });
}

function generateFooterMedia() {
    const container = document.getElementById("footer-media");
    if (isMobile()) {
        container.innerHTML = `<img src="/src/images/footer-drink.png" class="footer-media-content" />`;
    } else {
        container.innerHTML = `<video src="/src/videos/splash.mp4" autoplay playsinline muted  class="footer-media-content"></video>`;
    }
}

// Initialize content
window.addEventListener("load", () => {
    generateFlavors();
    generateNutrients();
    generateTestimonialCards();
    generateFooterMedia();

    // Wait a tick for DOM to be ready
    requestAnimationFrame(() => {
        initAnimations();
    });
});

// Handle resize
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        generateNutrients();
        generateFooterMedia();
        ScrollTrigger.refresh();
    }, 250);
});

// NavBar click handler
document.getElementById("nav-logo").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

function initAnimations() {
    // ============================================
    // HERO SECTION ANIMATIONS (from HeroSection.jsx)
    // ============================================
    const heroTitleSplit = splitTextIntoSpans(".hero-title", "chars");

    const heroTl = gsap.timeline({ delay: 1 });

    heroTl.to(".hero-content", {
        opacity: 1,
        y: 0,
        ease: "power1.inOut",
        duration: 0.8,
    })
        .to(".hero-text-scroll", {
            duration: 1,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "circ.out",
        }, "-=0.5")
        .from(heroTitleSplit.chars, {
            yPercent: 200,
            stagger: 0.02,
            ease: "power2.out",
            duration: 0.6,
        }, "-=0.5");

    // Hero scroll animation
    gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-container",
            start: "1% top",
            end: "bottom top",
            scrub: true,
        },
    }).to(".hero-container", {
        rotate: 7,
        scale: 0.9,
        yPercent: 30,
        ease: "power1.inOut",
    });

    // ============================================
    // MESSAGE SECTION ANIMATIONS (from MessageSection.jsx)
    // Word by word color reveal animation
    // ============================================
    const firstMsgSplit = splitTextIntoSpans(".first-message", "words");
    const secMsgSplit = splitTextIntoSpans(".second-message", "words");
    const msgParagraphSplit = splitTextIntoSpans(".message-paragraph", "words");

    // First message - word by word color change
    gsap.to(firstMsgSplit.words, {
        color: "#faeade",
        ease: "power1.in",
        stagger: 1,
        scrollTrigger: {
            trigger: ".message-content",
            start: "top center",
            end: "30% center",
            scrub: true,
        },
    });

    // Second message - word by word color change
    gsap.to(secMsgSplit.words, {
        color: "#faeade",
        ease: "power1.in",
        stagger: 1,
        scrollTrigger: {
            trigger: ".second-message",
            start: "top center",
            end: "bottom center",
            scrub: true,
        },
    });

    // "Fuel Up" reveal animation
    gsap.timeline({
        delay: 1,
        scrollTrigger: {
            trigger: ".msg-text-scroll",
            start: "top 60%",
        },
    }).to(".msg-text-scroll", {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "circ.inOut",
    });

    // Paragraph words animation
    gsap.timeline({
        scrollTrigger: {
            trigger: ".message-paragraph",
            start: "top center",
        },
    }).from(msgParagraphSplit.words, {
        yPercent: 300,
        rotate: 3,
        ease: "power1.inOut",
        duration: 1,
        stagger: 0.01,
    });

    // ============================================
    // FLAVOR SECTION ANIMATIONS (from FlavorTitle.jsx & FlavorSlider.jsx)
    // ============================================
    const firstTextSplit = splitTextIntoSpans(".first-text-split h1", "chars");
    const secondTextSplit = splitTextIntoSpans(".second-text-split h1", "chars");

    gsap.from(firstTextSplit.chars, {
        yPercent: 200,
        stagger: 0.02,
        ease: "power1.inOut",
        duration: 0.6,
        scrollTrigger: {
            trigger: ".flavor-section",
            start: "top 30%",
        },
    });

    gsap.to(".flavor-text-scroll", {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        scrollTrigger: {
            trigger: ".flavor-section",
            start: "top 10%",
        },
    });

    gsap.from(secondTextSplit.chars, {
        yPercent: 200,
        stagger: 0.02,
        ease: "power1.inOut",
        duration: 0.6,
        scrollTrigger: {
            trigger: ".flavor-section",
            start: "top 1%",
        },
    });

    // Horizontal scroll carousel for desktop
    ScrollTrigger.matchMedia({
        "(min-width: 1025px)": () => {
            const slider = document.querySelector(".slider-wrapper");
            const flavors = document.querySelector(".flavors");

            if (slider && flavors) {
                const scrollAmount = flavors.scrollWidth - window.innerWidth;

                gsap.timeline({
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: "2% top",
                        end: `+=${scrollAmount + 1500}px`,
                        scrub: true,
                        pin: true,
                    },
                }).to(".flavor-section", {
                    x: `-${scrollAmount + 1500}px`,
                    ease: "power1.inOut",
                });

                // Title scroll animations during horizontal scroll
                gsap.timeline({
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: "top top",
                        end: "bottom 80%",
                        scrub: true,
                    },
                })
                    .to(".first-text-split", { xPercent: -30, ease: "power1.inOut" })
                    .to(".flavor-text-scroll", { xPercent: -22, ease: "power1.inOut" }, "<")
                    .to(".second-text-split", { xPercent: -10, ease: "power1.inOut" }, "<");
            }
        },
        "(max-width: 1024px)": () => {
            gsap.set(".flavor-section", { clearProps: "all" });
        },
    });

    // ============================================
    // NUTRITION SECTION ANIMATIONS (from NutritionSection.jsx)
    // ============================================
    const nutritionTitleSplit = splitTextIntoSpans(".nutrition-title", "chars");

    gsap.timeline({
        scrollTrigger: {
            trigger: ".nutrition-section",
            start: "top center",
        },
    }).from(nutritionTitleSplit.chars, {
        yPercent: 100,
        stagger: 0.02,
        ease: "power2.out",
        duration: 0.6,
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".nutrition-section",
            start: "top 80%",
        },
    }).to(".nutrition-text-scroll", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
        ease: "power1.inOut",
    });

    // ============================================
    // BENEFIT SECTION ANIMATIONS (from BenefitSection.jsx)
    // ============================================
    gsap.timeline({
        delay: 1,
        scrollTrigger: {
            trigger: ".benefit-section",
            start: "top 60%",
            end: "top top",
            scrub: 1.5,
        },
    })
        .to(".benefit-section .first-title", {
            duration: 1,
            opacity: 1,
            clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
            ease: "circ.out",
        })
        .to(".benefit-section .second-title", {
            duration: 1,
            opacity: 1,
            clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
            ease: "circ.out",
        })
        .to(".benefit-section .third-title", {
            duration: 1,
            opacity: 1,
            clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
            ease: "circ.out",
        })
        .to(".benefit-section .fourth-title", {
            duration: 1,
            opacity: 1,
            clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
            ease: "circ.out",
        });

    // ============================================
    // VIDEO PIN SECTION ANIMATIONS (from VideoPinSection.jsx)
    // ============================================
    const videoBox = document.getElementById("video-box");

    if (!isMobile()) {
        videoBox.style.clipPath = "circle(6% at 50% 50%)";

        gsap.timeline({
            scrollTrigger: {
                trigger: ".vd-pin-section",
                start: "-15% top",
                end: "200% top",
                scrub: 1.5,
                pin: true,
            },
        }).to(".video-box", {
            clipPath: "circle(100% at 50% 50%)",
            ease: "power1.inOut",
        });
    } else {
        videoBox.style.clipPath = "circle(100% at 50% 50%)";
    }

    // ============================================
    // TESTIMONIALS SECTION ANIMATIONS (from TestimonialSection.jsx)
    // ============================================
    gsap.set(".testimonials-section", {
        marginTop: "-140vh",
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".testimonials-section",
            start: "top bottom",
            end: "200% top",
            scrub: true,
        },
    })
        .to(".testimonials-section .first-title", { xPercent: 70 })
        .to(".testimonials-section .sec-title", { xPercent: 25 }, "<")
        .to(".testimonials-section .third-title", { xPercent: -50 }, "<");

    gsap.timeline({
        scrollTrigger: {
            trigger: ".testimonials-section",
            start: "10% top",
            end: "200% top",
            scrub: 1.5,
            pin: true,
        },
    }).from(".vd-card", {
        yPercent: 150,
        stagger: 0.2,
        ease: "power1.inOut",
    });
}
