// Builds the page sections from knowledge.js and wires up the menu, service details, contact form and Ellie.
import { BIZ, PRICES, SERVICES, WHO_WE_HELP, CONDITIONS, CONTRAINDICATIONS, FAQ, ABOUT, TESTIMONIALS } from "./knowledge.js";
import { mountAssistant } from "./assistant.js";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// who we help (scrolling strip, duplicated for a seamless loop)
const chips = WHO_WE_HELP.map((w) => `<span>${esc(w)}</span>`).join("<i>✦</i>");
$("whoTrack").innerHTML = `<div>${chips}<i>✦</i></div><div aria-hidden="true">${chips}<i>✦</i></div>`;

// about
$("aboutIntro").textContent = ABOUT.intro;
$("aboutStory").textContent = ABOUT.story;
$("aboutMission").textContent = ABOUT.mission;
$("aboutPractice").textContent = ABOUT.practice;

// services
$("serviceCards").innerHTML = SERVICES.map((s) => `
  <article class="card" id="svc-${s.id}">
    <button class="card__hit" data-service="${s.id}" aria-label="More about ${esc(s.name)}"></button>
    <div class="card__img"><img src="assets/img/${s.img}" alt="" loading="lazy" /></div>
    <div class="card__body">
      <h3>${esc(s.name)}</h3>
      <p class="card__targets">${esc(s.targets)}</p>
      <p>${esc(s.short)}</p>
      <p class="card__meta">${esc(s.lengths)}</p>
      <span class="card__more">Details →</span>
    </div>
  </article>`).join("");

function openService(id) {
  const s = SERVICES.find((x) => x.id === id);
  if (!s) return;
  $("svcBody").innerHTML = `<button class="modal__x" data-close aria-label="Close">×</button>
    <div class="modal__img"><img src="assets/img/${s.img}" alt="" /></div>
    <div class="modal__copy"><p class="eyebrow">${esc(s.targets)}</p><h2>${esc(s.name)}</h2>
    ${s.body.map((p) => `<p>${esc(p)}</p>`).join("")}
    <p class="card__meta">${esc(s.lengths)}</p>
    <div class="modal__ctas"><a class="btn btn--primary" href="${BIZ.booking}" target="_blank" rel="noopener">Book online</a><a class="btn btn--glass" href="${BIZ.phoneHref}">Call ${BIZ.phone}</a><button class="btn btn--glass" data-ask="Tell me about ${esc(s.name.split(" (")[0])}">Ask Ellie</button></div></div>`;
  $("svcModal").showModal();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-service]");
  if (b) openService(b.dataset.service);
  if (e.target.closest("[data-close]") || e.target === $("svcModal")) $("svcModal").close();
});
window.addEventListener("open-service", (e) => openService(e.detail));

// pricing
$("priceGrid").innerHTML = PRICES.map((g) => `
  <div class="price-card">
    <h3>${esc(g.group)}</h3>
    ${g.items.map((i) => `<a class="price-row" href="${i.book}" target="_blank" rel="noopener">
      <div><b>${esc(i.name)}</b><small>${esc(i.note)}</small></div>
      <div class="price-row__num"><span>${i.mins} min</span><b>$${i.price}</b></div></a>`).join("")}
  </div>`).join("");

// testimonial
$("quoteText").textContent = `“${TESTIMONIALS[0].quote}”`;
$("quoteBy").textContent = `— ${TESTIMONIALS[0].by}`;

// conditions
$("condList").innerHTML = CONDITIONS.map((c) => `<li>${esc(c[0].toUpperCase() + c.slice(1))}</li>`).join("");
$("cautionBody").innerHTML = `<p>Please reschedule, or check with us and your healthcare provider first, if you have:</p><ul>${CONTRAINDICATIONS.map((c) => `<li>${esc(c)}</li>`).join("")}</ul><p>If you have any condition or take medication, consult your primary healthcare provider before your visit and always disclose it to your therapist. Sessions can often be adapted. Need a doctor referral form? Just ask.</p>`;

// FAQ
$("faqList").innerHTML = FAQ.map((f, i) => `<details class="faq__item" ${i === 0 ? "open" : ""}><summary>${esc(f.q)}<span aria-hidden="true">+</span></summary><p>${esc(f.a)}</p></details>`).join("");

// contact form → opens the visitor's email app with everything filled in
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const name = `${f.get("first")} ${f.get("last")}`.trim();
  const body = `${f.get("message")}\n\n— ${name}\n${f.get("email")}${f.get("phone") ? `\n${f.get("phone")}` : ""}`;
  location.href = `mailto:${BIZ.email}?subject=${encodeURIComponent(f.get("subject") || `Website message from ${name}`)}&body=${encodeURIComponent(body)}`;
  $("formNote").textContent = "Your email app should open with the message ready. Prefer to talk? Call 727-280-6424.";
});

// mobile menu + header shadow on scroll
$("navToggle").addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  $("navToggle").setAttribute("aria-expanded", String(open));
});
$("navLinks").addEventListener("click", (e) => { if (e.target.closest("a")) document.body.classList.remove("menu-open"); });
const onScroll = () => $("nav").classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

// gentle reveal-on-scroll
const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 }) : null;
document.querySelectorAll(".section, .card, .price-card").forEach((el) => { el.classList.add("reveal"); io ? io.observe(el) : el.classList.add("in"); });

$("year").textContent = new Date().getFullYear();
mountAssistant();
