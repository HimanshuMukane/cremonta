// register gsap plugins
gsap.registerplugin(scrolltrigger);

// constants
const flavorlists = [
    { name: "Classic Roast", color: "classic", rotation: "rotate-neg" },
    { name: "Hazelnut Blend", color: "hazelnut", rotation: "rotate-pos" },
    { name: "Espresso Intense", color: "espresso", rotation: "rotate-neg" },
    { name: "Caramel Instant", color: "caramel", rotation: "rotate-pos" },
    { name: "Vanilla Instant", color: "vanilla", rotation: "rotate-neg" },
    { name: "Dark Chocolate", color: "chocolate", rotation: "rotate-pos" },
];

const nutrientlists = [
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

// helper functions
const ismobile = () => window.matchmedia("(max-width: 768px)").matches;
const istablet = () => window.matchmedia("(max-width: 1024px)").matches;
const isdesktop = () => window.matchmedia("(min-width: 1025px)").matches;

// custom splittext
function splittextintospans(element, type = "chars") {
    const el = typeof element === 'string' ? document.queryselector(element) : element;
    if (!el) return { chars: [], words: [], lines: [] };

    const text = el.textcontent;
    const result = { chars: [], words: [], lines: [] };

    if (type.includes("words") || type.includes("chars")) {
        const words = text.split(/\s+/);
        el.innerhtml = '';

        words.forEach((word, index) => {
            const wordspan = document.createelement('span');
            wordspan.classname = 'split-word';
            wordspan.style.display = 'inline-block';

            if (type.includes("chars")) {
                word.split('').forEach(char => {
                    const charspan = document.createelement('span');
                    charspan.classname = 'split-char';
                    charspan.style.display = 'inline-block';
                    charspan.textcontent = char;
                    wordspan.appendchild(charspan);
                    result.chars.push(charspan);
                });
            } else {
                wordspan.textcontent = word;
            }

            el.appendchild(wordspan);
            result.words.push(wordspan);

            if (index < words.length - 1) {
                el.appendchild(document.createtextnode(' '));
            }
        });
    }

    return result;
}

// dynamic content
function generateflavors() {
    const container = document.getelementbyid("flavors-container");
    container.innerhtml = flavorlists.map(flavor => `
        <div class="flavor-card ${flavor.rotation}">
            <img src="src/images/${flavor.color}-bg.svg" class="bg" />
            <img src="src/images/${flavor.color}-drink.webp" class="drinks" />
            <img src="src/images/${flavor.color}-elements.webp" class="elements" />
            <h1>${flavor.name}</h1>
        </div>
    `).join("");

    initflavorparallax();
}

function initflavorparallax() {
    const flavorcards = document.queryselectorall('.flavor-card');

    flavorcards.forEach(card => {
        const drink = card.queryselector('.drinks');
        const elements = card.queryselector('.elements');

        const moveamount = 25;

        card.addeventlistener('mousemove', (e) => {
            const rect = card.getboundingclientrect();
            const centerx = rect.left + rect.width / 2;
            const centery = rect.top + rect.height / 2;

            const offsetx = (e.clientx - centerx) / (rect.width / 2);
            const offsety = (e.clienty - centery) / (rect.height / 2);

            if (drink) {
                gsap.to(drink, {
                    x: -offsetx * moveamount,
                    y: -offsety * moveamount,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }

            if (elements) {
                gsap.to(elements, {
                    x: offsetx * moveamount,
                    y: offsety * moveamount,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        card.addeventlistener('mouseleave', () => {
            if (drink) {
                gsap.to(drink, { x: 0, y: 0, duration: 0.5 });
            }
            if (elements) {
                gsap.to(elements, { x: 0, y: 0, duration: 0.5 });
            }
        });
    });
}

function generatenutrients() {
    const container = document.getelementbyid("nutrient-list");
    const liststoshow = ismobile() ? nutrientlists.slice(0, 3) : nutrientlists;

    container.innerhtml = liststoshow.map((nutrient, index) => `
        <div class="nutrient-item">
            <div>
                <p class="label">${nutrient.label}</p>
                <p class="up-to">up to</p>
                <p class="amount">${nutrient.amount}</p>
            </div>
            ${index !== liststoshow.length - 1 ? '<div class="spacer-border"></div>' : ''}
        </div>
    `).join("");
}

function generatetestimonialcards() {
    const container = document.getelementbyid("testimonial-cards");
    container.innerhtml = cards.map((card, index) => {
        const translatey = card.translation ? `translatey(${card.translation}%)` : '';
        const rotate = `rotate(${card.rotation}deg)`;
        return `
            <div class="vd-card" style="transform: ${translatey} ${rotate};" data-index="${index}">
                <video src="${card.src}" playsinline muted loop></video>
            </div>
        `;
    }).join("");

    document.queryselectorall(".vd-card").forEach((card) => {
        const video = card.queryselector("video");
        card.addeventlistener("mouseenter", () => video.play());
        card.addeventlistener("mouseleave", () => video.pause());
    });
}

function generatefootermedia() {
    const container = document.getelementbyid("footer-media");
    if (ismobile()) {
        container.innerhtml = `<img src="src/images/footer-drink.png" class="footer-media-content" />`;
    } else {
        container.innerhtml = `<video src="src/videos/splash.mp4" autoplay playsinline muted class="footer-media-content"></video>`;
    }
}

// initialize
window.addeventlistener("load", () => {
    generateflavors();
    generatenutrients();
    generatetestimonialcards();
    generatefootermedia();

    requestanimationframe(() => {
        initanimations();
    });
});

// resize
let resizetimeout;
window.addeventlistener("resize", () => {
    cleartimeout(resizetimeout);
    resizetimeout = settimeout(() => {
        generatenutrients();
        generatefootermedia();
        scrolltrigger.refresh();
    }, 250);
});

// navbar
document.getelementbyid("nav-logo").addeventlistener("click", () => {
    windowscrollto({ top: 0, behavior: "smooth" });
});

// animations
function initanimations() {
    // ---------------- hero section ----------------
    const herotitlesplit = splittextintospans(".hero-title", "chars");

    const herotl = gsap.timeline({ delay: 1 });

    herotl.to(".hero-content", {
        opacity: 1,
        y: 0,
        ease: "power1.inout",
        duration: 0.8
    })
    .to(".hero-text-scroll", {
        duration: 1,
        clippath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "circ.out",
    }, "-=0.5")
    .from(herotitlesplit.chars, {
        ypercent: 200,
        stagger: 0.02,
        ease: "power2.out",
        duration: 0.6
    }, "-=0.5");

    // hero scroll
    gsap.timeline({
        scrolltrigger: {
            trigger: ".hero-container",
            start: "1% top",
            end: "bottom top",
            scrub: true,
        },
    }).to(".hero-container", {
        rotate: 7,
        scale: 0.9,
        ypercent: 30,
        ease: "power1.inout",
    });

    // ---------------- message section ----------------
    const firstmsgsplit = splittextintospans(".first-message", "words");
    const secmsgsplit = splittextintospans(".second-message", "words");
    const msgparagraphsplit = splittextintospans(".message-paragraph", "words");

    gsap.to(firstmsgsplit.words, {
        color: "#faeade",
        ease: "power1.in",
        stagger: 1,
        scrolltrigger: {
            trigger: ".message-content",
            start: "top center",
            end: "30% center",
            scrub: true,
        },
    });

    gsap.to(secmsgsplit.words, {
        color: "#faeade",
        ease: "power1.in",
        stagger: 1,
        scrolltrigger: {
            trigger: ".second-message",
            start: "top center",
            end: "bottom center",
            scrub: true,
        },
    });

    gsap.timeline({
        delay: 1,
        scrolltrigger: {
            trigger: ".msg-text-scroll",
            start: "top 60%",
        },
    }).to(".msg-text-scroll", {
        duration: 1,
        clippath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "circ.inout",
    });

    gsap.timeline({
        scrolltrigger: {
            trigger: ".message-paragraph",
            start: "top center",
        },
    }).from(msgparagraphsplit.words, {
        ypercent: 300,
        rotate: 3,
        ease: "power1.inout",
        duration: 1,
        stagger: 0.01,
    });

    // ---------------- flavor section ----------------
    const firsttextsplit = splittextintospans(".first-text-split h1", "chars");
    const secondtextsplit = splittextintospans(".second-text-split h1", "chars");

    gsap.from(firsttextsplit.chars, {
        ypercent: 200,
        stagger: 0.02,
        ease: "power1.inout",
        duration: 0.6,
        scrolltrigger: {
            trigger: ".flavor-section",
            start: "top 30%",
        },
    });

    gsap.to(".flavor-text-scroll", {
        duration: 1,
        clippath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        scrolltrigger: {
            trigger: ".flavor-section",
            start: "top 10%",
        },
    });

    gsap.from(secondtextsplit.chars, {
        ypercent: 200,
        stagger: 0.02,
        ease: "power1.inout",
        duration: 0.6,
        scrolltrigger: {
            trigger: ".flavor-section",
            start: "top 1%",
        },
    });

    scrolltrigger.matchmedia({
        "(min-width: 1025px)": () => {
            const slider = document.queryselector(".slider-wrapper");
            const flavors = document.queryselector(".flavors");

            if (slider && flavors) {
                const scrollamount = flavors.scrollwidth - window.innerwidth;

                gsap.timeline({
                    scrolltrigger: {
                        trigger: ".flavor-section",
                        start: "2% top",
                        end: `+=${scrollamount + 1500}px`,
                        scrub: true,
                        pin: true,
                    },
                }).to(".flavor-section", {
                    x: `-${scrollamount + 1500}px`,
                    ease: "power1.inout",
                });

                gsap.timeline({
                    scrolltrigger: {
                        trigger: ".flavor-section",
                        start: "top top",
                        end: "bottom 80%",
                        scrub: true,
                    },
                })
                .to(".first-text-split", { xpercent: -30 })
                .to(".flavor-text-scroll", { xpercent: -22 }, "<")
                .to(".second-text-split", { xpercent: -10 }, "<");
            }
        },
        "(max-width: 1024px)": () => {
            gsap.set(".flavor-section", { clearprops: "all" });
        },
    });

    // ---------------- nutrition ----------------
    const nutritiontitlesplit = splittextintospans(".nutrition-title", "chars");

    gsap.timeline({
        scrolltrigger: {
            trigger: ".nutrition-section",
            start: "top center",
        },
    }).from(nutritiontitlesplit.chars, {
        ypercent: 100,
        stagger: 0.02,
        ease: "power2.out",
        duration: 0.6,
    });

    gsap.timeline({
        scrolltrigger: {
            trigger: ".nutrition-section",
            start: "top 80%",
        },
    }).to(".nutrition-text-scroll", {
        duration: 1,
        opacity: 1,
        clippath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
        ease: "power1.inout",
    });

    // ---------------- benefits ----------------
    gsap.timeline({
        delay: 1,
        scrolltrigger: {
            trigger: ".benefit-section",
            start: "top 60%",
            end: "top top",
            scrub: 1.5,
        },
    })
    .to(".benefit-section .first-title", {
        duration: 1,
        opacity: 1,
        clippath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
    })
    .to(".benefit-section .second-title", {
        duration: 1,
        opacity: 1,
        clippath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
    })
    .to(".benefit-section .third-title", {
        duration: 1,
        opacity: 1,
        clippath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
    })
    .to(".benefit-section .fourth-title", {
        duration: 1,
        opacity: 1,
        clippath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
    });

    // ---------------- video pin ----------------
    const videobox = document.getelementbyid("video-box");

    if (!ismobile()) {
        videobox.style.clippath = "circle(6% at 50% 50%)";

        gsap.timeline({
            scrolltrigger: {
                trigger: ".vd-pin-section",
                start: "-15% top",
                end: "200% top",
                scrub: 1.5,
                pin: true,
            },
        }).to(".video-box", {
            clippath: "circle(100% at 50% 50%)",
        });
    } else {
        videobox.style.clippath = "circle(100% at 50% 50%)";
    }

    // ---------------- testimonials ----------------
    gsap.set(".testimonials-section", {
        margintop: "-140vh",
    });

    gsap.timeline({
        scrolltrigger: {
            trigger: ".testimonials-section",
            start: "top bottom",
            end: "200% top",
            scrub: true,
        },
    })
    .to(".testimonials-section .first-title", { xpercent: 70 })
    .to(".testimonials-section .sec-title", { xpercent: 25 }, "<")
    .to(".testimonials-section .third-title", { xpercent: -50 }, "<");

    gsap.timeline({
        scrolltrigger: {
            trigger: ".testimonials-section",
            start: "10% top",
            end: "200% top",
            scrub: 1.5,
            pin: true,
        },
    }).from(".vd-card", {
        ypercent: 150,
        stagger: 0.2,
        ease: "power1.inout",
    });
}
