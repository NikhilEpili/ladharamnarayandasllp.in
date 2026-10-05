document.addEventListener("DOMContentLoaded", function () {
  initBrandMarquee();
  initMobileNav();
  initEnquiryForm();
});

function initEnquiryForm() {
  var form = document.querySelector("#enquiry form");
  if (!form) return;
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
  var track = marquee.querySelector(".brand-marquee__track");
  var set = marquee.querySelector(".brand-marquee__set");
  if (!track || !set) return;

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
