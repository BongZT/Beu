// --- 1. STATE & CONSTANTS ---
let isAdultView = true;
let inactivityTimer;
const navbar = document.getElementById('navbar');

// --- 2. PACKAGE SLIDER ---
function changePackage(direction) {
    const adultView = document.getElementById('senior-view');
    const juniorView = document.getElementById('junior-view');
    
    if (!adultView || !juniorView) return;

    isAdultView = !isAdultView; // Flips state

    if (isAdultView) {
        adultView.classList.add('active');
        juniorView.classList.remove('active');
    } else {
        juniorView.classList.add('active');
        adultView.classList.remove('active');
    }
}

// --- 3. ACCORDIONS ---
function toggleLux(header) {
    const item = header.parentElement;
    const content = item.querySelector('.lux-content');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.lux-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.lux-content').style.maxHeight = null;
    });

    if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

// --- 4. NAVIGATION AUTO-HIDE LOGIC ---
const showNav = () => {
    if (!navbar) return;
    navbar.classList.remove('nav-hidden');
    navbar.style.pointerEvents = "auto";
};

const hideNav = () => {
    if (!navbar) return;
    // Only hide if the user isn't at the very top of the page
    if (window.pageYOffset > 100) {
        navbar.classList.add('nav-hidden');
    }
};

const resetInactivityTimer = () => {
    showNav();
    window.clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        hideNav();
    }, 2000); // 2 seconds of inactivity before hiding
};

// Listen for mouse movement and scrolling to keep nav visible
window.addEventListener('mousemove', (e) => {
    // Reveal if mouse moves near the top or while nav is hidden
    if (e.clientY <= 100 || (navbar && navbar.classList.contains('nav-hidden'))) {
        resetInactivityTimer();
    }
});
window.addEventListener('scroll', resetInactivityTimer);

// --- 5. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        // Your scroll and showNav logic goes here
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        });
    }
    // Initial Team Rendering
    renderTeam();

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
            menuBtn.classList.toggle('active');
        });
        navLinks.forEach(link => link.addEventListener('click', () => {
            navMenu.classList.remove('nav-active');
            menuBtn.classList.remove('active');
        }));
    }

    // Copy to Clipboard Logic
    document.querySelectorAll('.copy-trigger').forEach(card => {
        card.addEventListener('click', function() {
            const text = this.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                const badge = this.querySelector('.copy-badge');
                if (badge) {
                    badge.innerText = "Copied!";
                    setTimeout(() => { badge.innerText = "Tap to Copy"; }, 2000);
                }
            });
        });
    });

    // Ensure nav is visible on load
    resetInactivityTimer();
});

// --- 6. TEAM DATA & RENDERER ---
const instructors = [
    { name: "Sarah J.", specialty: "Contemporary Lead", image: "./sarah.jpg" },
    { name: "Marcus V.", specialty: "Hip Hop Specialist", image: "./marcus.jpg" },
    { name: "Elena R.", specialty: "Ballet Mistress", image: "./elena.jpg" }
];

function renderTeam() {
    const grid = document.getElementById('instructor-grid');
    if (!grid) return;
    grid.innerHTML = instructors.map(p => `
        <div class="member" data-aos="fade-up">
            <div class="member-image-wrap"><img src="${p.image}" alt="${p.name}"></div>
            <h3>${p.name}</h3><p>${p.specialty}</p>
        </div>`).join('');
}   