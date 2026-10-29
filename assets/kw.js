// Skórka KW (wzór klindworthroofing.com, 29.10.2026): menu-nakładka, karuzela oferty, przełączane opinie
(function () {
  var btn = document.querySelector('.kw-burger');
  var menu = document.getElementById('kw-menu');
  if (!btn || !menu) return;
  function set(open) {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('kw-menu-on', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { set(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();

// Karuzela oferty: strzałki przewijają o jedną kartę, pasek pokazuje położenie
(function () {
  var car = document.querySelector('.kw-car');
  if (!car) return;
  var track = car.querySelector('.kw-car-track');
  var prev = car.querySelector('[data-car="prev"]');
  var next = car.querySelector('[data-car="next"]');
  var bar = car.querySelector('.kw-car-bar i');
  function step() {
    var it = track.querySelector('.kw-car-item');
    if (!it) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return it.getBoundingClientRect().width + gap;
  }
  function upd() {
    var max = track.scrollWidth - track.clientWidth;
    var x = track.scrollLeft;
    if (prev) prev.disabled = x <= 4;
    if (next) next.disabled = x >= max - 4;
    if (bar) {
      var w = Math.max(12, Math.min(100, track.clientWidth / track.scrollWidth * 100));
      bar.style.width = w + '%';
      var p = max > 0 ? x / max : 0;
      bar.style.transform = 'translateX(' + (p * (100 / w * 100 - 100)) + '%)';
    }
  }
  if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(upd); }, { passive: true });
  window.addEventListener('resize', upd, { passive: true });
  window.addEventListener('load', upd);
  upd();
})();

// Opinie: jedna na raz, strzałki przełączają
(function () {
  var box = document.querySelector('.kw-kudos');
  if (!box) return;
  var slides = [].slice.call(box.querySelectorAll('.kw-k-slide'));
  if (slides.length < 2) return;
  var i = 0;
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { if (k === i) s.removeAttribute('hidden'); else s.setAttribute('hidden', ''); });
  }
  var p = box.querySelector('[data-k="prev"]'), n = box.querySelector('[data-k="next"]');
  if (p) p.addEventListener('click', function () { show(i - 1); });
  if (n) n.addEventListener('click', function () { show(i + 1); });
})();
