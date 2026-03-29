console.log("main.js carregou ✅");

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

gsap.registerPlugin(ScrollTrigger);
console.log("GSAP:", typeof gsap, "ScrollTrigger:", typeof ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;

if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: false,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
    });
  });
} else {
  console.warn("Lenis não carregou. Seguindo sem smooth scroll.");
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

window.addEventListener("resize", () => ScrollTrigger.refresh());

const clamp = gsap.utils.clamp;
const q = (sel, root = document) => root.querySelector(sel);

/* HERO scanline */
if (!reduceMotion) {
  gsap.to(".scanline", {
    y: 120,
    opacity: 0.15,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}

/* Terminal typing */
const terminal = document.getElementById("term");

const text = `$ mvn clean test
[INFO] web-e2e: 3 passed
[INFO] api-tests: 1 passed
[INFO] BUILD SUCCESS
`;

let index = 0;
let speed = 18;

function typeWriter() {
  if (!terminal) return;
  if (index < text.length) {
    terminal.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }
}

window.addEventListener("load", () => {
  typeWriter();
});

/* BG grid parallax */
if (!reduceMotion) {
  gsap.to(".bg-grid", {
    backgroundPosition: "120px 80px, 80px 120px",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });
}

/* Spotlight por seção */
if (!reduceMotion) {
  const panels = gsap.utils.toArray(".panel");

  panels.forEach((panel) => {
    panel.style.setProperty("--sx", "35%");
    panel.style.setProperty("--sy", "45%");
    panel.style.setProperty("--overlayOpacity", "0");
    panel.style.setProperty("--streakOpacity", "0");
    panel.style.setProperty("--streakX", "-60%");
    panel.style.setProperty("--streakY", "10%");

    const setSX = gsap.quickSetter(panel, "--sx");
    const setSY = gsap.quickSetter(panel, "--sy");

    ScrollTrigger.create({
      trigger: panel,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const dir = panel.classList.contains("alt-left") ? 1 : -1;

        const x = clamp(20, 80, 50 + dir * (p - 0.5) * 30);
        const y = clamp(25, 75, 45 + (p - 0.5) * 20);

        setSX(`${x}%`);
        setSY(`${y}%`);

        const ovBase = Math.sin(p * Math.PI);
        const ov = clamp(0, 1, ovBase) * 0.22;
        panel.style.setProperty("--overlayOpacity", ov.toFixed(3));

        const st = (ovBase * 0.10);
        panel.style.setProperty("--streakOpacity", st.toFixed(3));

        const streakX = -60 + p * 120;
        panel.style.setProperty("--streakX", `${streakX}%`);
      }
    });
  });
}

/* Helper */
function animateWhenActive(panel, build) {
  if (reduceMotion) return;

  let tl = null;

  ScrollTrigger.create({
    trigger: panel,
    start: "top 65%",
    end: "bottom 35%",
    onEnter: () => {
      if (!tl) tl = build();
      tl.play(0);
    },
    onEnterBack: () => {
      if (!tl) tl = build();
      tl.play(0);
    },
    onLeave: () => tl && tl.pause(0),
    onLeaveBack: () => tl && tl.pause(0)
  });
}



/* PROJETOS */
(function () {
  const panel = document.getElementById("projetos");
  if (!panel) return;

  const bug = panel.querySelector(".o-bug");
  const lupa = panel.querySelector(".o-lupa");
  if (!bug || !lupa) return;

  animateWhenActive(panel, () => {
    const tl = gsap.timeline({ paused: true, repeat: -1 });

    tl.to(lupa, {
      rotation: 360,
      duration: 4.2,
      ease: "none",
      transformOrigin: "50% 50%"
    }, 0);

    tl.to(bug, {
      y: -3,
      rotation: 4,
      duration: 0.45,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 7
    }, 0.25);

    return tl;
  });
})();

/* SKILLS */
(function () {
  const panel = document.getElementById("skills");
  if (!panel) return;

  const icon = panel.querySelector(".icon-skills");
  if (!icon) return;

  animateWhenActive(panel, () => {
    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      icon,
      { scale: 0.94, opacity: 0.18 },
      { scale: 1, opacity: 0.34, duration: 0.45, ease: "power2.out" }
    );

    tl.to(icon, {
      scale: 1.03,
      duration: 1.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    return tl;
  });
})();

/* EXPERIÊNCIA */
(function () {
  const panel = document.getElementById("exp");
  if (!panel) return;

  const icon = panel.querySelector(".icon-exp");
  if (!icon) return;

  animateWhenActive(panel, () => {
    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      icon,
      { scale: 0.9, y: 10, opacity: 0.12 },
      { scale: 1, y: 0, opacity: 0.34, duration: 0.42, ease: "back.out(1.7)" }
    );

    tl.to(icon, {
      y: -8,
      duration: 1.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    return tl;
  });
})();

/* TIMELINE */
(function () {
  const panel = document.getElementById("exp");
  if (!panel) return;

  const items = panel.querySelectorAll(".timeline-item");
  const line = panel.querySelector(".timeline-line");

  if (!line || items.length === 0) return;

  animateWhenActive(panel, () => {
    const tl = gsap.timeline({ paused: true });

    // anima linha
    tl.to(line, {
      scaleY: 1,
      duration: 0.8,
      ease: "power2.out"
    });

    // anima cards
    tl.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.18
    }, "-=0.25");

    // ativa conexão lateral
    tl.call(() => {
      items.forEach(item => item.classList.add("reveal"));
    }, null, "-=0.45");

    return tl;
  });
})();

/* Carrossel — showcase */
(function () {
  const viewport = document.querySelector("#projetos .carousel");
  const nextBtn = document.querySelector("#projetos .carousel-btn.next");
  const prevBtn = document.querySelector("#projetos .carousel-btn.prev");
  const dotsEl = document.querySelector("#projetos .carousel-dots");

  if (!viewport) return;

  const cards = Array.from(viewport.querySelectorAll(".project-card"));
  const total = cards.length;
  if (!total) return;

  let currentIndex = 0;
  let autoplay = null;

  function getPrevIndex(index) {
    return (index - 1 + total) % total;
  }

  function getNextIndex(index) {
    return (index + 1) % total;
  }

  function clearStates(card) {
    card.classList.remove(
      "is-active",
      "is-prev",
      "is-next",
      "is-hidden-left",
      "is-hidden-right"
    );
  }

  function updateCards() {
    const prevIndex = getPrevIndex(currentIndex);
    const nextIndex = getNextIndex(currentIndex);

    cards.forEach((card, index) => {
      clearStates(card);

      if (index === currentIndex) {
        card.classList.add("is-active");
      } else if (index === prevIndex) {
        card.classList.add("is-prev");
      } else if (index === nextIndex) {
        card.classList.add("is-next");
      } else {
        card.classList.add(index < currentIndex ? "is-hidden-left" : "is-hidden-right");
      }
    });

    updateDots();
  }

  function goTo(index) {
    currentIndex = (index + total) % total;
    updateCards();
    restartAutoplay();
  }

  function goNext() {
    goTo(currentIndex + 1);
  }

  function goPrev() {
    goTo(currentIndex - 1);
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";

    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Ir para o projeto ${index + 1}`);
      dot.addEventListener("click", () => goTo(index));
      dotsEl.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsEl) return;
    const dots = Array.from(dotsEl.querySelectorAll(".carousel-dot"));
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  }

  function stopAutoplay() {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(() => {
      currentIndex = getNextIndex(currentIndex);
      updateCards();
    }, 4500);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextBtn?.addEventListener("click", goNext);
  prevBtn?.addEventListener("click", goPrev);

  buildDots();
  updateCards();
  startAutoplay();
})();

/* Float menu */
(() => {
  const floatBar = document.querySelector(".topbar--float");
  const btn = document.querySelector(".topbar--float .menu-btn");
  const nav = document.querySelector(".topbar--float .nav--float");
  if (!floatBar || !btn || !nav) return;

  const SHOW_AFTER = 60;
  let hasHintPlayed = false;
  let hintTimeoutOpen = null;
  let hintTimeoutClose = null;

  function playMenuHint() {
    if (hasHintPlayed) return;
    hasHintPlayed = true;

    hintTimeoutOpen = setTimeout(() => {
      floatBar.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Fechar menu");

      hintTimeoutClose = setTimeout(() => {
        floatBar.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Abrir menu");
      }, 850);
    }, 180);
  }

  const setState = (y) => {
    const scrolled = y > SHOW_AFTER;
    document.body.classList.toggle("is-scrolled", scrolled);

    if (scrolled) {
      playMenuHint();
    }

    if (!scrolled) {
      floatBar.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menu");
    }
  };

  btn.addEventListener("click", () => {
    if (hintTimeoutOpen) clearTimeout(hintTimeoutOpen);
    if (hintTimeoutClose) clearTimeout(hintTimeoutClose);

    const willOpen = !floatBar.classList.contains("is-open");
    floatBar.classList.toggle("is-open", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
    btn.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      floatBar.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menu");
    });
  });

  document.addEventListener("click", (e) => {
    if (!floatBar.classList.contains("is-open")) return;
    if (!floatBar.contains(e.target)) {
      floatBar.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menu");
    }
  });

  window.addEventListener("scroll", () => setState(window.scrollY), { passive: true });

  if (typeof lenis !== "undefined" && lenis) {
    lenis.on("scroll", ({ scroll }) => setState(scroll));
  }

  setState(window.scrollY);
})();

/* Nav ativa */
const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
const targets = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const floatBtn = document.querySelector(".topbar--float .menu-btn");

function setActiveLink() {
  const y = window.scrollY + 160;
  let current = null;

  for (const el of targets) {
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (y >= top && y < bottom) current = el;
  }

  navLinks.forEach(a => a.classList.remove("active"));

  if (current) {
    navLinks
      .filter(a => a.getAttribute("href") === `#${current.id}`)
      .forEach(a => a.classList.add("active"));
  }

  if (floatBtn) {
    floatBtn.classList.toggle("has-active", !!current);
    floatBtn.setAttribute("data-active", current ? current.id : "");
  }
}

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", setActiveLink);
setActiveLink();

ScrollTrigger.refresh();

/* Back to Top — aparece só no contato */
(() => {
  const backToTop = document.getElementById("backToTop");
  const contato = document.getElementById("contato");
  const home = document.getElementById("home");

  if (!backToTop || !contato || !home) return;

  function toggleBackToTop() {
    const contatoTop = contato.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.65;

    if (contatoTop <= triggerPoint) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  window.addEventListener("load", toggleBackToTop);

  if (typeof lenis !== "undefined" && lenis) {
    lenis.on("scroll", toggleBackToTop);
  }

  backToTop.addEventListener("click", () => {
    if (typeof lenis !== "undefined" && lenis) {
      lenis.scrollTo(home, { offset: 0 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
})();

/* SOBRE — card surge, avatar fica */
(() => {
  const panel = document.getElementById("sobre");
  if (!panel || reduceMotion) return;

  const card = panel.querySelector(".sobre-wrapper");
  if (!card) return;

  gsap.set(card, {
    y: 90,
    opacity: 0
  });

  ScrollTrigger.create({
    trigger: panel,
    start: "top 96%",
    once: false,
    onEnter: () => {
      gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 1.35,
        delay: 0.35,
        ease: "power3.out"
      });
    },
    onLeaveBack: () => {
      gsap.set(card, {
        y: 90,
        opacity: 0
      });
    }
  });
})();

/* SKILLS — grid surge, título fica */
(() => {
  const panel = document.getElementById("skills");
  if (!panel || reduceMotion) return;

  const grid = panel.querySelector(".skills-grid");
  const cards = panel.querySelectorAll(".skill-card");
  if (!grid || !cards.length) return;

  gsap.set(grid, {
    y: 80,
    opacity: 0
  });

  gsap.set(cards, {
    y: 26,
    opacity: 0
  });

  ScrollTrigger.create({
    trigger: panel,
    start: "top 97%",
    once: false,
    onEnter: () => {
      const tl = gsap.timeline();

      tl.to(grid, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out"
      });

      tl.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.13
      }, "-=0.18");
    },
    onLeaveBack: () => {
      gsap.set(grid, {
        y: 80,
        opacity: 0
      });

      gsap.set(cards, {
        y: 26,
        opacity: 0
      });
    }
  });
})();

/* CONTATO — conteúdo surge, avatar fica */
(() => {
  const panel = document.getElementById("contato");
  if (!panel || reduceMotion) return;

  const copy = panel.querySelector(".contato-copy");
  if (!copy) return;

  gsap.set(copy, {
    y: 56,
    opacity: 0
  });

  ScrollTrigger.create({
    trigger: panel,
    start: "top 85%",
    once: false,
    onEnter: () => {
      gsap.to(copy, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.25,
        ease: "power3.out"
      });
    },
    onLeaveBack: () => {
      gsap.set(copy, {
        y: 56,
        opacity: 0
      });
    }
  });
})();

/* Theme toggle + Hint */
(() => {
  const themeToggle = document.getElementById("themeToggle");
  const themeHint = document.getElementById("themeHint");
  const themeHintText = document.getElementById("themeHintText");

  if (!themeToggle) return;

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "night") {
    document.documentElement.classList.add("theme-night");
    document.body.classList.add("theme-night");

    themeToggle.setAttribute("aria-pressed", "true");
    themeToggle.setAttribute("aria-label", "Ativar modo claro");
  }

  function updateThemeHintText() {
    if (!themeHintText) return;

    const isNight = document.documentElement.classList.contains("theme-night");

    themeHintText.innerHTML = isNight
      ? "Modo claro<br>disponível"
      : "Modo noturno<br>disponível";
  }

  function hideThemeHint() {
    if (!themeHint || themeHint.classList.contains("is-hidden")) return;

    themeHint.classList.add("is-hidden");
    themeHint.style.transition = "opacity .3s ease, transform .3s ease";
    themeHint.style.opacity = "0";
    themeHint.style.transform = "translateY(-6px)";
    themeHint.style.pointerEvents = "none";

    setTimeout(() => {
      themeHint.style.display = "none";
    }, 300);
  }

  if (themeHint) {
    updateThemeHintText();
    setTimeout(() => {
      hideThemeHint();
    }, 4000);
  }

  themeToggle.addEventListener("click", () => {
    const willBeNight = !document.documentElement.classList.contains("theme-night");

    document.documentElement.classList.toggle("theme-night", willBeNight);
    document.body.classList.toggle("theme-night", willBeNight);

    themeToggle.setAttribute("aria-pressed", String(willBeNight));
    themeToggle.setAttribute(
      "aria-label",
      willBeNight ? "Ativar modo claro" : "Ativar modo noturno"
    );

    localStorage.setItem("portfolio-theme", willBeNight ? "night" : "light");

    updateThemeHintText();
    hideThemeHint();
  });
})();