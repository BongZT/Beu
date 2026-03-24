const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("mobile-menu-btn");
const navMenu = document.getElementById("nav-menu");
const overlay = document.getElementById("menu-overlay");

const packageViews = [
  document.getElementById("senior-view"),
  document.getElementById("junior-view"),
];
const prevPackageBtn = document.getElementById("prev-package");
const nextPackageBtn = document.getElementById("next-package");

let currentPackageIndex = 0;
let inactivityTimer = null;

const instructors = [
  { name: "Sarah J.", specialty: "Contemporary Lead", image: "https://via.placeholder.com/300x400" },
  { name: "Marcus V.", specialty: "Hip Hop Specialist", image: "https://via.placeholder.com/300x400" },
  { name: "Elena R.", specialty: "Ballet Mistress", image: "https://via.placeholder.com/300x400" }
];

function initAOS() {
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: false
    });
  }
}

function showNav() {
  if (!navbar) return;
  navbar.classList.remove("nav-hidden");
}

function hideNav() {
  if (!navbar) return;
  if (window.scrollY > 120 && !navMenu.classList.contains("nav-active")) {
    navbar.classList.add("nav-hidden");
  }
}

function resetNavTimer() {
  showNav();
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(hideNav, 2200);
}

function openMenu() {
  navMenu.classList.add("nav-active");
  menuBtn.classList.add("active");
  overlay.classList.add("active");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navMenu.classList.remove("nav-active");
  menuBtn.classList.remove("active");
  overlay.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function toggleMenu() {
  if (navMenu.classList.contains("nav-active")) {
    closeMenu();
  } else {
    openMenu();
  }
}

function showPackage(index) {
  currentPackageIndex = index;

  packageViews.forEach((view, i) => {
    if (!view) return;
    view.classList.toggle("active", i === currentPackageIndex);
  });
}

function changePackage(direction) {
  currentPackageIndex =
    (currentPackageIndex + direction + packageViews.length) % packageViews.length;
  showPackage(currentPackageIndex);
}

function setupAccordion() {
  const headers = document.querySelectorAll(".lux-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.closest(".lux-item");
      const content = item.querySelector(".lux-content");
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".lux-item").forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherContent = otherItem.querySelector(".lux-content");
        if (otherContent) otherContent.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

function setupCopyCards() {
  const cards = document.querySelectorAll(".copy-trigger");

  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const textToCopy = card.dataset.copy;
      const badge = card.querySelector(".copy-badge");
      if (!textToCopy || !badge) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }

        const originalText = badge.textContent;
        const originalBg = badge.style.background;
        const originalColor = badge.style.color;

        badge.textContent = "Copied!";
        badge.style.background = "#28a745";
        badge.style.color = "#fff";
        badge.style.borderColor = "#28a745";

        setTimeout(() => {
          badge.textContent = originalText;
          badge.style.background = originalBg;
          badge.style.color = originalColor;
          badge.style.borderColor = "";
        }, 1800);
      } catch (error) {
        console.error("Copy failed:", error);
      }
    });
  });
}

function renderTeam() {
  const grid = document.getElementById("instructor-grid");
  if (!grid) return;

  grid.innerHTML = instructors
    .map(
      (person) => `
        <div class="member" data-aos="fade-up">
          <div class="member-image-wrap">
            <img src="${person.image}" alt="${person.name}">
          </div>
          <h3>${person.name}</h3>
          <p>${person.specialty}</p>
        </div>
      `
    )
    .join("");
}

function setupEvents() {
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  if (prevPackageBtn) {
    prevPackageBtn.addEventListener("click", () => changePackage(-1));
  }

  if (nextPackageBtn) {
    nextPackageBtn.addEventListener("click", () => changePackage(1));
  }

  window.addEventListener("scroll", resetNavTimer, { passive: true });
  window.addEventListener("mousemove", (e) => {
    if (e.clientY <= 120) resetNavTimer();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTeam();
  setupAccordion();
  setupCopyCards();
  setupEvents();
  showPackage(0);
  initAOS();
  resetNavTimer();
});