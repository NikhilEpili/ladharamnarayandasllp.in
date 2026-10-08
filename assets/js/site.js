document.addEventListener("DOMContentLoaded", function () {
  initBrandMarquee();
  initMobileNav();
  initEnquiryForm();
  initMotion();
});

function initEnquiryForm() {
  var form = document.getElementById("enquiry");
  if (!form || form.tagName !== "FORM") return;
  var btn = form.querySelector('button[type="button"]');
  if (!btn) return;
  btn.addEventListener("click", function () {
    var biz = (document.getElementById("biz") || {}).value || "";
    var ph = (document.getElementById("ph") || {}).value || "";
    var loc = (document.getElementById("loc") || {}).value || "";
    var bt = (document.getElementById("bt") || {}).value || "";
    var msg = (document.getElementById("msg") || {}).value || "";
    var lines = [
      "Supply enquiry — Ladharam Narayandas LLP",
      biz && "Business: " + biz,
      ph && "Phone: " + ph,
      loc && "Location: " + loc,
      bt && "Business type: " + bt,
      msg && "Requirements: " + msg,
    ].filter(Boolean);
    var url =
      "https://wa.me/918928351313?text=" +
      encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function initMobileNav() {
  var btn = document.querySelector(".hero-menu-btn");
  var nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;

  nav.removeAttribute("hidden");

  function setOpen(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    nav.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function toggleMenu() {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  nav.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      btn.focus();
    }
  });

  setOpen(false);
}

function initBrandMarquee() {
  var marquee = document.querySelector(".brand-marquee");
  if (!marquee) return;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        if (!entries.some(function (e) {
          return e.isIntersecting;
        })) {
          return;
        }
        io.disconnect();
        bootBrandMarquee(marquee);
      },
      { rootMargin: "240px 0px" }
    );
    io.observe(marquee);
    return;
  }
  bootBrandMarquee(marquee);
}

function bootBrandMarquee(marquee) {
  var track = marquee.querySelector(".brand-marquee__track");
  var set = marquee.querySelector(".brand-marquee__set");
  if (!track || !set) return;

  ensureMarqueeClone(track, set);
  track.querySelectorAll(".brand-marquee__set").forEach(wrapMarqueeLogos);

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  var loopSeconds = 42;
  var shift = 0;
  var offset = 0;
  var speed = 0;
  var rafId = 0;
  var lastTime = 0;

  function trackGapPx() {
    var g = getComputedStyle(track).gap;
    if (!g || g === "normal") return 0;
    var n = parseFloat(g);
    return Number.isFinite(n) ? n : 0;
  }

  function measureShift() {
    var next = set.offsetWidth + trackGapPx();
    if (next <= 0) return false;
    if (shift > 0) {
      var ratio = offset / shift;
      shift = next;
      offset = ratio * shift;
      while (offset <= -shift) offset += shift;
      while (offset > 0) offset -= shift;
    } else {
      shift = next;
    }
    speed = shift / loopSeconds;
    return true;
  }

  function applyTransform() {
    track.style.setProperty("--brand-marquee-x", offset + "px");
  }

  function frame(time) {
    rafId = requestAnimationFrame(frame);
    if (!lastTime) lastTime = time;
    var dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    if (shift <= 0 || speed <= 0) return;
    offset -= speed * dt;
    while (offset <= -shift) offset += shift;
    applyTransform();
  }

  function boot() {
    if (!measureShift()) return;
    applyTransform();
    if (!rafId) {
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    }
  }

  document.addEventListener("visibilitychange", function () {
    lastTime = 0;
  });

  whenMarqueeImagesReady(track, boot);

  setTimeout(boot, 120);
  setTimeout(boot, 800);

  if (typeof ResizeObserver !== "undefined") {
    var ro = new ResizeObserver(boot);
    ro.observe(set);
  } else {
    window.addEventListener("resize", boot);
  }

  track.querySelectorAll("img").forEach(function (img) {
    if (!img.complete) img.addEventListener("load", boot, { once: true });
  });
}

function ensureMarqueeClone(track, set) {
  if (track.querySelectorAll(".brand-marquee__set").length > 1) return;
  var clone = set.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll("img").forEach(function (img) {
    img.alt = "";
    img.removeAttribute("loading");
  });
  track.appendChild(clone);
}

function wrapMarqueeLogos(setEl) {
  setEl.querySelectorAll("img").forEach(function (img) {
    if (img.parentElement && img.parentElement.classList.contains("brand-marquee__item")) {
      return;
    }
    var slot = document.createElement("span");
    slot.className = "brand-marquee__item";
    img.parentNode.insertBefore(slot, img);
    slot.appendChild(img);
  });
}

function whenMarqueeImagesReady(root, cb) {
  var imgs = root.querySelectorAll("img");
  var waiting = 0;
  imgs.forEach(function (img) {
    if (!img.complete) waiting++;
  });
  if (waiting === 0) {
    cb();
    return;
  }
  var loaded = 0;
  function done() {
    loaded++;
    if (loaded >= waiting) cb();
  }
  imgs.forEach(function (img) {
    if (img.complete) return;
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
  setTimeout(cb, 2500);
}

function initMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".split-text").forEach(function (el) {
      el.classList.add("is-played");
    });
    document
      .querySelectorAll(".reveal, .reveal-fade, .reveal-group, .hero-stats, .brands-frame, .section-head")
      .forEach(function (el) {
        el.classList.add("is-visible");
      });
    return;
  }

  document.querySelectorAll(".split-text").forEach(prepareSplitText);
  indexRevealGroups();
  observeMotion();
  playHeroMotion();
}

function prepareSplitText(el) {
  if (el.dataset.splitReady === "1") return;
  var mode = el.getAttribute("data-split") || "rise";
  var label = el.textContent.replace(/\s+/g, " ").trim();
  el.setAttribute("aria-label", label);
  el.dataset.splitReady = "1";

  var index = 0;
  var source = Array.prototype.slice.call(el.childNodes);
  var frag = document.createDocumentFragment();

  function appendWord(text, accent) {
    if (!text) return;
    if (mode === "fold") {
      for (var c = 0; c < text.length; c++) {
        var ch = document.createElement("span");
        ch.className = accent ? "split-char split-char--accent" : "split-char";
        ch.style.setProperty("--i", index++);
        ch.textContent = text.charAt(c);
        ch.setAttribute("aria-hidden", "true");
        frag.appendChild(ch);
      }
      return;
    }
    var wrap = document.createElement("span");
    wrap.className = "split-word";
    var inner = document.createElement("span");
    inner.className = accent ? "split-word-inner split-word--accent" : "split-word-inner";
    inner.style.setProperty("--i", index++);
    inner.textContent = text;
    inner.setAttribute("aria-hidden", "true");
    wrap.appendChild(inner);
    frag.appendChild(wrap);
  }

  source.forEach(function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var parts = node.textContent.split(/(\s+)/);
      parts.forEach(function (part) {
        if (/^\s+$/.test(part)) {
          var gap = document.createElement("span");
          gap.className = "split-word--gap";
          gap.textContent = part;
          gap.setAttribute("aria-hidden", "true");
          frag.appendChild(gap);
        } else if (part) {
          appendWord(part, false);
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "EM") {
      appendWord(node.textContent.trim(), true);
    }
  });

  if (!frag.childNodes.length) {
    appendWord(label, false);
  }

  el.textContent = "";
  el.appendChild(frag);
}

function indexRevealGroups() {
  document.querySelectorAll(".reveal-group").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--i", i);
    });
  });
  document.querySelectorAll(".hero-stats .st").forEach(function (st, i) {
    st.style.setProperty("--i", i);
  });
}

function observeMotion() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".split-text, .reveal, .reveal-fade, .reveal-group, .hero-stats, .brands-frame, .section-head")
      .forEach(function (el) {
        el.classList.add("is-visible");
        el.classList.add("is-played");
      });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = entry.target;
        if (target.classList.contains("split-text")) {
          target.classList.add("is-played");
        } else {
          target.classList.add("is-visible");
        }
        io.unobserve(target);
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  document.querySelectorAll(".split-text").forEach(function (el) {
    io.observe(el);
  });
  document.querySelectorAll(".reveal, .reveal-fade, .reveal-group, .hero-stats, .brands-frame, .section-head").forEach(function (el) {
    io.observe(el);
  });
}

function playHeroMotion() {
  var heroTitle = document.querySelector("#hero .split-text");
  var heroLead = document.querySelector(".hero-lead");
  var heroActions = document.querySelector(".hero-actions");
  var heroStats = document.querySelector(".hero-stats");

  window.requestAnimationFrame(function () {
    if (heroTitle) heroTitle.classList.add("is-played");
    if (heroLead) {
      heroLead.classList.add("reveal", "is-visible");
    }
    if (heroActions) {
      heroActions.classList.add("reveal", "is-visible");
      heroActions.style.setProperty("--reveal-delay", "120ms");
    }
    if (heroStats) {
      setTimeout(function () {
        heroStats.classList.add("is-visible");
      }, 280);
    }
  });
}
