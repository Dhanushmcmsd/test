(function () {
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".menu-overlay");
  const menu = document.getElementById("mobile-menu");
  const mobileLinks = menu ? menu.querySelectorAll("a") : [];

  function isMobile() {
    return window.innerWidth <= 720;
  }

  function setMenuOpen(open) {
    if (!burger || !overlay || !menu) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);

    if (open) {
      overlay.hidden = false;
      menu.hidden = false;
      requestAnimationFrame(() => {
        overlay.classList.add("is-visible");
        menu.classList.add("is-visible");
      });
    } else {
      overlay.classList.remove("is-visible");
      menu.classList.remove("is-visible");
      const onEnd = () => {
        overlay.hidden = true;
        menu.hidden = true;
        menu.removeEventListener("transitionend", onEnd);
      };
      menu.addEventListener("transitionend", onEnd);
      if (getComputedStyle(menu).transitionDuration === "0s") {
        onEnd();
      }
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (burger) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) closeMenu();
  });

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatValue(value, decimals) {
    return value.toFixed(decimals);
  }

  function animateStat(statEl, index) {
    const valueEl = statEl.querySelector("[data-value]");
    if (!valueEl || statEl.dataset.counted === "true") return;

    const target = parseFloat(statEl.dataset.target, 10);
    const suffix = statEl.dataset.suffix || "";
    const decimals = parseInt(statEl.dataset.decimals || "0", 10);
    const duration = 1500 + index * 80;
    const startDelay = 480 + index * 90;
    const startTime = performance.now() + startDelay;

    statEl.dataset.counted = "true";

    function tick(now) {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      const current = target * easeOutCubic(t);
      valueEl.textContent = formatValue(current, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else valueEl.textContent = formatValue(target, decimals) + suffix;
    }

    requestAnimationFrame(tick);
  }

  const stats = document.querySelectorAll(".stat");
  if (stats.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const stat = entry.target;
          const index = Array.from(stats).indexOf(stat);
          animateStat(stat, index);
          observer.unobserve(stat);
        });
      },
      { threshold: 0.25 }
    );
    stats.forEach((stat) => observer.observe(stat));
  } else {
    stats.forEach((stat, i) => animateStat(stat, i));
  }
})();
