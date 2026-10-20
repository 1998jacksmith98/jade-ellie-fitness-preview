const WA = "https://wa.me/447476929022";
const WA_GROUP = "https://chat.whatsapp.com/F4NZ916MHPY9FshHsHrJ7d";
const IG = "https://www.instagram.com/jadeelliefitness/";
const BOOK = "https://bookwhen.com/jadeelliefitness";
const ENQUIRE = "enquire.html";
const MAD = "https://maps.google.com/?q=The+MAD+Studio+5+Marechal+Niel+Parade+Sidcup";
const EMAIL = "mailto:jadeelliefitness@gmail.com";

const page = location.pathname.split("/").pop() || "index.html";
const home = page === "enquire.html" ? "index.html" : "";

document.getElementById("site-header").innerHTML = `
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="index.html">
        <img src="photos/logo.jpg" alt="Jade Ellie Fitness" />
      </a>
      <nav class="desk-nav">
        <a href="${home}#work">Ways to train</a>
        <a href="${home}#classes">Reformer</a>
        <a href="${home}#pt">PT</a>
        <a href="${home}#studio">Sessions</a>
        <a href="${home}#reviews">Reviews</a>
        <a href="${ENQUIRE}">Enquire</a>
        <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" hidden>
    <nav>
      <a href="${home}#work">Ways to train</a>
      <a href="${home}#classes">Reformer</a>
      <a href="${home}#pt">PT</a>
      <a href="${home}#studio">Sessions</a>
      <a href="${home}#reviews">Reviews</a>
      <a href="${ENQUIRE}">Enquire</a>
      <a href="${BOOK}" target="_blank" rel="noreferrer">Book reformer</a>
      <a href="${IG}" target="_blank" rel="noreferrer">Instagram</a>
    </nav>
  </div>
  <div class="mobile-cta">
    <a class="btn" data-enquire href="${ENQUIRE}">Enquire</a>
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
        <p><a href="${WA_GROUP}" target="_blank" rel="noreferrer">Join the girls group</a></p>
        <p><a href="${BOOK}" target="_blank" rel="noreferrer">Book reformer</a></p>
        <p><a href="${EMAIL}">jadeelliefitness@gmail.com</a></p>
      </div>
      <div>
        <p><a href="${IG}" target="_blank" rel="noreferrer">Instagram</a></p>
        <p><a href="${ENQUIRE}">Enquire</a></p>
        <p><a href="${home}#pt">Personal training</a></p>
      </div>
    </div>
    <div class="wrap credit">Website built by <a href="https://halfpennydigital.co.uk/">Halfpenny Digital</a> · <a href="privacy.html">Privacy policy</a></div>
  </footer>
`;

if (ENQUIRE) {
  document.querySelectorAll("[data-enquire]").forEach((link) => {
    link.href = ENQUIRE;
    link.removeAttribute("target");
    link.removeAttribute("rel");
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

(function reel() {
  const track = document.querySelector(".scrub");
  const video = document.querySelector(".scrub-video");
  const groups = [...document.querySelectorAll(".scrub-copy")].map((copy) =>
    [...copy.querySelectorAll(".scrub-line")]
  );
  if (!track || !video) return;

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const play = () => {
    video.muted = true;
    const attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(() => {});
  };

  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) play();
      else video.pause();
    });
  }, { threshold: 0.15 });
  seen.observe(track);
  video.addEventListener("loadeddata", play);

  const update = () => {
    const rect = track.getBoundingClientRect();
    const run = Math.max(track.offsetHeight - window.innerHeight, 1);
    const scrolled = Math.min(Math.max(-rect.top, 0), run);
    const t = scrolled / run;
    groups.forEach((lines) => {
      lines.forEach((line, i) => {
        const start = 0.12 + i * 0.22;
        line.classList.toggle("is-on", t >= start);
      });
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

(function reviews() {
  const scroller = document.getElementById("quote-scroller");
  const track = document.getElementById("quotes");
  const dots = document.getElementById("quote-dots");
  if (!scroller || !track || !dots) return;
  const cards = [...track.children];
  const buttons = cards.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Review " + (i + 1));
    b.addEventListener("click", () => cards[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" }));
    dots.appendChild(b);
    return b;
  });
  const mark = () => {
    const mid = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      card.classList.toggle("is-active", dist < card.offsetWidth * 0.45);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    buttons.forEach((b, i) => b.classList.toggle("is-on", i === best));
  };
  mark();
  scroller.addEventListener("scroll", mark, { passive: true });
})();
