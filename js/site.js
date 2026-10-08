const WA = "https://wa.me/447476929022";
const IG = "https://www.instagram.com/jadeelliefitness/";
const BOOK = "https://bookwhen.com/jadeelliefitness";
const ENQUIRE = "";
const MAD = "https://maps.google.com/?q=The+MAD+Studio+5+Marechal+Niel+Parade+Sidcup";

const page = location.pathname.split("/").pop() || "index.html";

document.getElementById("site-header").innerHTML = `
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="index.html">
        <img src="photos/logo.jpg" alt="Jade Ellie Fitness" />
      </a>
      <nav class="desk-nav">
        <a href="#work">Ways to train</a>
        <a href="#classes">Reformer</a>
        <a href="#pt">PT</a>
        <a href="#studio">Sessions</a>
        <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" hidden>
    <nav>
      <a href="#work">Ways to train</a>
      <a href="#classes">Reformer</a>
      <a href="#pt">PT</a>
      <a href="#studio">Sessions</a>
      <a href="${BOOK}" target="_blank" rel="noreferrer">Book reformer</a>
      <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
    </nav>
  </div>
  <div class="mobile-cta">
    <a class="btn" data-enquire href="#enquire">Enquire</a>
    <a class="btn ghost" href="${BOOK}" target="_blank" rel="noreferrer">Book reformer</a>
  </div>
`;

document.getElementById("site-footer").innerHTML = `
  <footer>
    <div class="wrap footer-grid">
      <div>
        <p class="foot-name">Jade Ellie Fitness</p>
        <p>Personal training and reformer pilates.</p>
        <p><a href="${MAD}" target="_blank" rel="noreferrer">MAD Studio, 5 Marechal Niel Parade, Main Road, Sidcup DA14 6QF</a></p>
        <p>Reformer classes: Salus House, 17 Foots Cray High Street, DA14 5HJ</p>
      </div>
      <div>
        <p><a href="${WA}" target="_blank" rel="noreferrer">WhatsApp</a></p>
        <p><a href="${BOOK}" target="_blank" rel="noreferrer">Book reformer</a></p>
        <p><a href="mailto:jadeelliefitness@gmail.com">Email</a></p>
      </div>
      <div>
        <p><a href="${IG}" target="_blank" rel="noreferrer">Instagram</a></p>
        <p><a href="#classes">Reformer</a></p>
        <p><a href="#pt">Personal training</a></p>
      </div>
    </div>
    <div class="wrap credit">Website built by <a href="https://halfpennydigital.co.uk/">Halfpenny Digital</a></div>
  </footer>
`;

if (ENQUIRE) {
  document.querySelectorAll("[data-enquire]").forEach((link) => {
    link.href = ENQUIRE;
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".mobile-nav");
btn.addEventListener("click", () => {
  const open = !nav.hasAttribute("hidden");
  if (open) {
    nav.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-expanded", "false");
  } else {
    nav.removeAttribute("hidden");
    document.body.classList.add("menu-open");
    btn.setAttribute("aria-label", "Close");
    btn.setAttribute("aria-expanded", "true");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    nav.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-expanded", "false");
  });
});

(function dockAfterHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const sync = () => {
    if (window.innerWidth > 819) {
      document.body.classList.remove("dock-on");
      return;
    }
    const bottom = hero.getBoundingClientRect().bottom;
    if (bottom < 90) document.body.classList.add("dock-on");
    else document.body.classList.remove("dock-on");
  };
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
})();

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-stagger]").forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${80 + i * 90}ms`;
      io.observe(child);
    });
  });
} else {
  document.querySelectorAll(".reveal, [data-stagger] > *").forEach((el) => el.classList.add("is-in"));
}

(function scrub() {
  const track = document.querySelector(".scrub");
  const video = document.querySelector(".scrub-video");
  if (!track || !video) return;

  video.muted = true;
  video.loop = false;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const arm = () => {
    video.muted = true;
    const play = video.play();
    if (play && play.then) {
      play.then(() => {
        video.pause();
      }).catch(() => {});
    }
  };

  video.addEventListener("loadeddata", arm, { once: true });
  window.addEventListener("touchstart", arm, { passive: true });
  window.addEventListener("click", arm);
  video.addEventListener("ended", () => {
    video.pause();
    if (video.duration) video.currentTime = Math.max(video.duration * 0.9, 0);
    arm();
  });

  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) arm();
    });
  }, { threshold: 0.2 });
  seen.observe(track);

  let ticking = false;
  const update = () => {
    ticking = false;
    if (!video.duration) return;
    if (video.ended) arm();
    const rect = track.getBoundingClientRect();
    const run = track.offsetHeight - window.innerHeight;
    if (run <= 0) return;
    const scrolled = Math.min(Math.max(-rect.top, 0), run);
    const t = (scrolled / run) * Math.max(video.duration * 0.92, 0);
    if (Math.abs(video.currentTime - t) > 0.03) {
      try { video.currentTime = t; } catch (e) {}
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  video.addEventListener("loadedmetadata", update);
})();
