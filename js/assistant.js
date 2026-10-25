// "Ellie", Elevated's website assistant. Runs entirely in the browser: no account, no API key, no cost.
// It only answers from knowledge.js (the clinic's own information), so it never makes things up.
// When a question isn't covered, it says so and offers the phone number, email and booking link.
import { BIZ, PRICES, SERVICES, CONDITIONS, CONTRAINDICATIONS, FAQ, ABOUT, WHO_WE_HELP } from "./knowledge.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const bookBtn = (href = BIZ.booking, label = "Book online") => `<a class="chat-btn" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
const callBtn = `<a class="chat-btn chat-btn--ghost" href="${BIZ.phoneHref}">Call ${BIZ.phone}</a>`;
const svc = (id) => SERVICES.find((s) => s.id === id);
const allPrices = PRICES.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
const priceLine = (i) => `<li><b>${esc(i.name)}</b>: ${i.mins} min, <b>$${i.price}</b></li>`;

// Which service a message is about (also remembered for follow-ups like "how much is it?")
const SERVICE_WORDS = [
  ["neurodiverse", /\b(neuro ?diverse|autis\w*|sensory|touch sensitiv\w*|sensitive to touch|adhd|hypersensitiv\w*|motor disabilit\w*)\b/],
  ["first-visit", /\b(first (time|visit|appointment|session)|new (client|patient)|initial|assessment|intake)\b/],
  ["kids", /\b(kids?|child\w*|son|daughter|teen\w*|youth|minor|my boy|my girl)\b/],
  ["seniors", /\b(senior\w*|elderly|older|65|aging|grand(ma|pa|mother|father|parent)s?|retire\w*)\b/],
  ["sports", /\b(sports?|athlet\w*|recovery|pre[- ]?event|post[- ]?event|training|marathon|race|game|tournament)\b/],
  ["neuromuscular", /\b(neuro ?muscular|medical massage|deep tissue|trigger point)\b/],
  ["cupping", /\b(cup|cups|cupping|iastm|scraping|gua sha|blanket)\b/],
  ["thai", /\b(thai|sen lines?|floor mat|tatami|yoga massage)\b/],
  ["set", /\b(set|structural energetic|kinesiology|myofascial|somatic)\b/],
  ["stretch", /\b(stretch\w*|flexib\w*|pnf)\b/],
  ["breathwork", /\b(breath ?work|breathing|breathe)\b/],
];
function serviceIn(text) { for (const [id, re] of SERVICE_WORDS) if (re.test(text)) return id; return null; }

const CONDITION_WORDS = [
  [/\b(back|lower back|spine)\b/, "back pain"], [/\bneck\b/, "neck pain"], [/\bshoulders?\b/, "shoulder pain"], [/\bspasms?\b/, "muscle spasms"],
  [/\b(tmj|jaw)\b/, "jaw pain / TMJ"], [/\bwhiplash\b/, "whiplash"], [/\b(nerves?|pinched)\b/, "nerve injuries and entrapments"],
  [/\bcarpal\b/, "carpal tunnel syndrome"], [/\bsciatica\b/, "sciatica"], [/\bparkinson\w*\b/, "Parkinson's disease"],
  [/\bcirculation\b/, "poor circulation"], [/\b(tendinitis|tendonitis|tendinosis|bursitis|arthritis|osteoporosis)\b/, "tendinitis, bursitis and arthritis"],
  [/\bpalsy\b/, "cerebral or Bell's palsy"], [/\bfibromyalgia\b/, "fibromyalgia"], [/\b(stress|anxiety|depress\w*|grief|tension)\b/, "stress, anxiety, grief and emotional tension"],
  [/\b(headaches?|migraines?)\b/, "headaches and migraines"], [/\b(scar|surgery|surgical|post[- ]?op)\b/, "scar tissue and surgical recovery"],
  [/\b(disc|disk|herniat\w*|bulg\w*)\b/, "degenerative or herniated discs"], [/\b(car accident|auto accident|accident|crash)\b/, "auto accident injuries"],
  [/\bthoracic outlet\b/, "thoracic outlet syndrome"], [/\brestless leg\w*\b/, "restless leg syndrome"], [/\beye strain\b/, "eye strain"],
  [/\b(tennis elbow|golfer'?s elbow|elbow)\b/, "tennis or golfer's elbow"], [/\brotator cuff\b/, "rotator cuff conditions"],
  [/\b(plantar|fasciitis|arch(es)?|feet|foot|ankles?|heel)\b/, "foot and ankle conditions, including plantar fasciitis"],
  [/\b(knees?|hips?|hamstrings?|calf|calves|quads?|it band|joints?|strain|pull(ed)?|sprain)\b/, "joint pain, strains and pulls"],
  [/\b(numb\w*|tingl\w*)\b/, "tingling and numbness"], [/\b(hands?|forearms?|wrists?)\b/, "hand, wrist and forearm pain"],
];
const CAUTION_WORDS = [
  [/\bfever\b/, "a fever"], [/\b(blood thinners?|warfarin|eliquis|xarelto|anticoagula\w*)\b/, "blood thinners"], [/\b(clots?|thrombosis|dvt)\b/, "a history of blood clots"],
  [/\b(open wound|wounds?|bruis\w*)\b/, "deep bruises or open wounds"], [/\b(rash|sunburn)\b/, "a rash or severe sunburn"], [/\b(dizz\w*|nause\w*)\b/, "dizziness or nausea"],
  [/\b(drunk|intoxicat\w*|narcotic|opioid\w*)\b/, "intoxication or narcotic pain medication"], [/\b(just (got hurt|injured)|yesterday|48 hours|today i (fell|got hurt))\b/, "an injury from the last 48 hours"],
  [/\b(pregnan\w*|prenatal)\b/, "pregnancy"], [/\b(cancer|chemo\w*)\b/, "cancer treatment"],
];

// Intents: keyword weights → answer. The highest score wins.
const INTENTS = [
  { id: "greet", re: [[/^\s*(hi|hey|hello|yo|good (morning|afternoon|evening)|howdy|hiya|hola)\b/, 3]],
    answer: () => `${pick(["Hi there! 👋", "Hello! 😊", "Hey! Welcome."])} I'm Ellie, Elevated's assistant. I can help you pick a treatment, check prices, plan your first visit, or get you booked.`,
    chips: ["What do you offer?", "Prices", "First visit", "Book an appointment"] },
  { id: "thanks", re: [[/\b(thanks?|thank you|thx|ty|appreciate|awesome|perfect|great)\b/, 2]],
    answer: () => pick(["You're so welcome! Anything else I can help with?", "Happy to help 💙 Anything else?", "Anytime! Feel free to ask me anything else."]),
    chips: ["Book an appointment", "Contact info"] },
  { id: "book", re: [[/\b(book\w*|appointment|schedul\w*|availab\w*|reserve|openings?|slots?|sign up)\b/, 3]],
    answer: () => `Booking is online through Jane, where you can see real-time availability. <b>New to Elevated?</b> Start with the <b>Initial Assessment</b> (90 min, $150), which is required before other treatments.<div class="chat-actions">${bookBtn(allPrices[0].book, "Book first visit")}${bookBtn()}</div>`,
    chips: ["What happens at the first visit?", "Prices", "Where are you located?"] },
  { id: "price", re: [[/\b(price\w*|cost\w*|how much|rates?|fees?|charge|\$|expensive|afford\w*|pricing)\b/, 3]],
    answer: (ctx) => {
      const id = ctx.service;
      if (id === "first-visit") return `The <b>Initial Assessment</b> (first visit) is <b>90 minutes for $150</b>, including intake and your first treatment.<div class="chat-actions">${bookBtn(allPrices[0].book, "Book first visit")}</div>`;
      if (id === "thai") return `<b>Medical Thai Massage</b>:<ul>${PRICES[2].items.map(priceLine).join("")}</ul><div class="chat-actions">${bookBtn(PRICES[2].items[1].book, "Book Thai massage")}</div>`;
      if (id === "sports" || id === "neuromuscular") return `<b>Medical sports / injury & recovery</b> treatments:<ul>${PRICES[1].items.map(priceLine).join("")}</ul>New clients start with the 90-minute Initial Assessment ($150).<div class="chat-actions">${bookBtn()}</div>`;
      if (id) { const s = svc(id); return `<b>${esc(s.name)}</b>: ${esc(s.lengths)}. Online booking currently lists Medical Sports Massage (60 min $135 · 90 min $175 · 120 min $225) and Medical Thai Massage (90 min $175 · 120 min $225), and techniques like cupping and stretching are often part of those sessions. For exact pricing on ${esc(s.name.toLowerCase())}, give the clinic a quick call so I don't guess.<div class="chat-actions">${callBtn}${bookBtn()}</div>`; }
      return `Here's the current menu:${PRICES.map((g) => `<p class="chat-sub">${esc(g.group)}</p><ul>${g.items.map(priceLine).join("")}</ul>`).join("")}Ask about package discounts for regular care!<div class="chat-actions">${bookBtn()}</div>`;
    }, chips: ["What happens at the first visit?", "Do you take insurance?", "Book an appointment"] },
  { id: "services", re: [[/\b(services?|offer\w*|treatments?|menu|what do you do|types? of massage|options|kinds?)\b/, 2.5]],
    answer: () => `We offer:<ul>${SERVICES.map((s) => `<li><b>${esc(s.name)}</b>: ${esc(s.short)}</li>`).join("")}</ul>Tell me what's bothering you, or what you're training for, and I'll suggest a starting point.`,
    chips: ["Cupping", "Sports massage", "Medical Thai massage", "For kids"] },
  { id: "service", re: [], answer: (ctx) => {
      const s = svc(ctx.service);
      return `<b>${esc(s.name)}</b>${s.targets ? ` <span class="chat-muted">· ${esc(s.targets)}</span>` : ""}<p>${s.body.slice(0, 2).map(esc).join("</p><p>")}</p><p class="chat-muted">${esc(s.lengths)}</p><div class="chat-actions">${bookBtn()}<a class="chat-btn chat-btn--ghost" href="#svc-${s.id}" data-open-service="${s.id}">More details</a></div>`;
    }, chips: (ctx) => [`How much is ${svc(ctx.service).name.split(" (")[0].toLowerCase()}?`, "How long is a session?", "Book an appointment"] },
  { id: "firstvisit", re: [[/\b(first (time|visit|appointment)|new (client|patient)|never been|what (to|should i) expect|initial|intake|assessment)\b/, 3.2]],
    answer: () => `Welcome! Your first visit is a <b>90-minute Initial Assessment ($150)</b>:<ul><li>You'll get an intake form by email when you book</li><li>We review your goals and history</li><li>We may check posture, gait, range of motion and muscle activation</li><li>Then your first treatment, and a plan for what's next</li></ul>Come hydrated and in comfortable clothes.<div class="chat-actions">${bookBtn(allPrices[0].book, "Book first visit")}</div>`,
    chips: ["How should I prepare?", "Do you take insurance?", "Where are you located?"] },
  { id: "duration", re: [[/\b(how long|length|minutes?|hours?|duration|60|90|120)\b/, 2]],
    answer: (ctx) => ctx.service ? `<b>${esc(svc(ctx.service).name)}</b>: ${esc(svc(ctx.service).lengths)}.` : `Treatments run <b>60, 90 or 120 minutes</b>, and many clients choose 90 minutes to 2 hours. The first visit is a 90-minute Initial Assessment.`,
    chips: ["Prices", "Book an appointment"] },
  { id: "insurance", re: [[/\b(insurance|insured|hsa|fsa|claim|attorney|lawyer|pip|copay|billing|bill)\b/, 3.5]],
    answer: () => `Insurance isn't billed directly. If you're filing an injury claim (like after an auto accident), you may be able to bill your services. Check with your attorney or insurance provider to verify coverage. Need a doctor referral form? Just ask your therapist.`,
    chips: ["Do you treat car accident injuries?", "Prices"] },
  { id: "prepare", re: [[/\b(prepare|prep|before|after(wards)?|wear|clothes|clothed|clothing|dress(ed)?|bring|hydrat\w*|water|undress\w*|naked|nude)\b/, 3]],
    answer: (ctx) => {
      if (ctx.service === "cupping") return `For cupping: hydrate well for several days before your appointment. If you have photos or lots of sun coming up, plan around it or tell your therapist so marks can be avoided. Afterward, take time to relax.`;
      if (ctx.service === "thai" || ctx.service === "stretch") return `For ${ctx.service === "thai" ? "Medical Thai Massage" : "Stretch Therapy"} you stay <b>fully clothed</b>: wear loose, comfortable fitness clothing.`;
      return `<b>Before:</b> come well hydrated, wear comfortable clothing, and plan to relax; steady deep breathing helps you get the best results.<br><b>After:</b> drink 16+ oz of water and follow up with your therapist about your plan. For Thai massage and stretch therapy you stay fully clothed in loose fitness wear.`;
    }, chips: ["Will cupping leave marks?", "Book an appointment"] },
  { id: "location", re: [[/\b(where|location|located|address|directions?|parking|park|map|find you|st\.? pete|saint petersburg|tampa)\b/, 3]],
    answer: () => `We're at <b>${esc(BIZ.address)}</b> in St. Pete.<div class="chat-actions"><a class="chat-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BIZ.mapsQuery)}">Get directions ↗</a></div><span class="chat-muted">Questions about parking or access? Call ${BIZ.phone}.</span>`,
    chips: ["Contact info", "Book an appointment"] },
  { id: "contact", re: [[/\b(contact|phone|call|number|email|reach|text|message|talk to (someone|a person|human))\b/, 3]],
    answer: () => `📞 <a href="${BIZ.phoneHref}">${BIZ.phone}</a><br>✉️ <a href="mailto:${BIZ.email}">${BIZ.email}</a><br>📍 ${esc(BIZ.address)}<div class="chat-actions">${callBtn}<a class="chat-btn chat-btn--ghost" href="#contact">Send a message</a></div>`,
    chips: ["Book an appointment", "Where are you located?"] },
  { id: "hours", re: [[/\b(hours?|open|close[ds]?|weekends?|saturday|sunday|today|tomorrow|evening|morning|when are you)\b/, 2.6]],
    answer: () => `Appointments are by booking, and you can see live availability (including evenings and weekends, when offered) on the online booking page. For same-day questions, call ${BIZ.phone}.<div class="chat-actions">${bookBtn(BIZ.booking, "See availability")}</div>`,
    chips: ["Book an appointment", "Contact info"] },
  { id: "therapist", re: [[/\b(who|therapists?|teresa|owner|staff|practitioners?|lmt|licensed|certified|experience|qualified)\b/, 2.4]],
    answer: () => `Your therapist is <b>${BIZ.therapist}</b>, a massage therapist specializing in medical sports massage and medical Thai massage, with certifications in medical cupping. Clients say she's "very intuitive and knowledgeable." Elevated has served St. Pete since ${BIZ.since}, working with thousands of athletes and a trusted network of doctors, PTs and trainers.`,
    chips: ["What do you offer?", "Book an appointment"] },
  { id: "about", re: [[/\b(about|story|history|since|mission|who are you|elevated)\b/, 1.8]],
    answer: () => `${esc(ABOUT.intro)} ${esc(ABOUT.story.split(". ").slice(0, 2).join(". "))}.`,
    chips: ["Who will treat me?", "What do you offer?"] },
  { id: "marks", re: [[/\b(marks?|bruis\w*|hurt|painful|sore|soreness|uncomfortable|hickeys?)\b/, 3]],
    answer: (ctx) => ctx.service === "cupping" || /cup/.test(ctx.text) ? FAQ[7].a : `Medical massage can be firm, and some techniques are briefly uncomfortable, but your therapist works with you and your comfort level, and the goal is always explained. Mild soreness for a day or so can happen; drink plenty of water afterward. Cupping can leave temporary marks that fade in 5–10 days.`,
    chips: ["How should I prepare?", "Cupping"] },
  { id: "frequency", re: [[/\b(how often|frequency|how many (sessions|times|visits)|weekly|monthly|maintenance|packages?|discounts?|deals?|membership)\b/, 3]],
    answer: () => `${FAQ[2].a}`, chips: ["Prices", "Book an appointment"] },
  { id: "gift", re: [[/\b(gift ?cards?|gift|present|certificate|voucher)\b/, 3.5]],
    answer: () => `Yes! Gift cards can be created on the online booking page (sign in, then choose Gift Card) and sent to a friend or loved one. 🎁<div class="chat-actions">${bookBtn(BIZ.booking, "Buy a gift card")}</div>`,
    chips: ["Prices", "What do you offer?"] },
  { id: "cancel", re: [[/\b(cancel\w*|reschedul\w*|running late|no[- ]show|refund|policy|policies)\b/, 4]],
    answer: () => `You can manage or reschedule appointments through your Jane booking account. For the cancellation policy, or if you're running late, please call <a href="${BIZ.phoneHref}">${BIZ.phone}</a>.`,
    chips: ["Contact info"] },
  { id: "community", re: [[/\b(charity|charities|events?|community|veterans?|volunteer|fundrais\w*|nonprofit|sponsor\w*)\b/, 3]],
    answer: () => FAQ[10].a, chips: ["Contact info"] },
  { id: "conditions", re: [[/\b(conditions?|treat|help with|good for|work on|injur\w*|pain|ache|aching|hurts?)\b/, 1.5]],
    answer: () => `Massage can help with many conditions, including ${CONDITIONS.slice(0, 10).join(", ")}, and more. We specialize in ${WHO_WE_HELP.slice(0, 6).join(", ").toLowerCase()} and more. What's going on? I can point you to the right treatment.`,
    chips: ["Back pain", "Sports injury", "Headaches", "Stress"] },
];

function recommend(cond) {
  if (/stress|anxiety|grief|emotional/.test(cond)) return ["breathwork", "set"];
  if (/accident|whiplash|surgical|scar|disc|nerve|numb/.test(cond)) return ["neuromuscular", "first-visit"];
  if (/plantar|foot|elbow|rotator|joint|strain|tendin/.test(cond)) return ["sports", "cupping"];
  if (/circulation|fibromyalgia|parkinson|palsy/.test(cond)) return ["neuromuscular", "seniors"];
  return ["neuromuscular", "cupping"];
}

/** Answer one message. ctx carries the last service talked about, for follow-ups. */
export function reply(text, ctx = {}) {
  const t = ` ${text.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9$'\s.-]/g, " ")} `;
  const mentioned = serviceIn(t);
  const c = { ...ctx, text: t, service: mentioned || ctx.service || null };

  // medical caution first: never brush past a safety question
  const caution = CAUTION_WORDS.find(([re]) => re.test(t));
  if (caution) {
    const what = caution[1];
    const special = what === "pregnancy" || what === "cancer treatment";
    return { html: `Thanks for sharing that. With ${esc(what)}, please ${special ? "call the clinic before booking so the therapist can talk through what's safe and appropriate for you" : "check with your healthcare provider first, and tell your therapist when you book"}. Massage isn't recommended with ${CONTRAINDICATIONS.slice(0, 4).join(", ")}, among a few others, but sessions can often be adapted.<div class="chat-actions">${callBtn}</div>`, chips: ["What conditions do you help with?", "Contact info"], ctx: c };
  }

  // score intents
  let best = null, bestScore = 0;
  for (const it of INTENTS) {
    let sc = 0;
    for (const [re, w] of it.re) if (re.test(t)) sc += w;
    if (sc > bestScore) { best = it; bestScore = sc; }
  }
  // "do you help with sciatica?" → condition answer
  const cond = CONDITION_WORDS.find(([re]) => re.test(t));
  if (cond && (!best || ["conditions", "marks", "about", "therapist", "duration"].includes(best.id) || bestScore < 2.5)) {
    const ids = [...new Set([...(mentioned && mentioned !== "first-visit" ? [mentioned] : []), ...recommend(cond[1])])].slice(0, 2);
    const recs = ids.map(svc);
    return { html: `Yes, medical massage can help with ${esc(cond[1])}. 💙 A good place to start:<ul>${recs.map((s) => `<li><b>${esc(s.name)}</b>: ${esc(s.short)}</li>`).join("")}</ul>New clients begin with the 90-minute Initial Assessment ($150) so your therapist can find the root cause and build a plan.<div class="chat-actions">${bookBtn(allPrices[0].book, "Book first visit")}</div>`, chips: ["What happens at the first visit?", "Do you take insurance?", "Prices"], ctx: { ...c, service: recs[0].id } };
  }
  // a service named with no other intent → describe it
  if (mentioned && (!best || bestScore < 2 || best.id === "services" || best.id === "conditions" || best.id === "about")) best = INTENTS.find((i) => i.id === "service");
  // "do you do hot stone?" → not on the menu (never pretend we offer it)
  if (!mentioned && (!best || bestScore < 2.5) && /\b(do you (do|offer|have|provide)|can i (get|book)|is there an?|offer)\b/.test(t)) {
    return { html: `I don't see that on Elevated's menu, and I don't want to guess. Elevated focuses on medical and therapeutic work: ${SERVICES.filter((x) => x.id !== "first-visit").map((x) => x.name.split(" (")[0]).join(", ")}. For anything else, give the clinic a quick call.<div class="chat-actions">${callBtn}</div>`, chips: ["What do you offer?", "Prices"], ctx: c };
  }
  if (!best || (bestScore === 0 && best.id !== "service")) {
    const q = FAQ.find((f) => f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 4).filter((w) => t.includes(` ${w}`)).length >= 2);
    if (q) return { html: esc(q.a), chips: ["Book an appointment", "Prices"], ctx: c };
    return { html: `Hmm, I'm not sure about that one, and I'd rather not guess. 😊 The clinic can answer directly:<br>📞 <a href="${BIZ.phoneHref}">${BIZ.phone}</a> · ✉️ <a href="mailto:${BIZ.email}">${BIZ.email}</a><br>Or ask me about services, prices, first visits, cupping, insurance or booking.`, chips: ["What do you offer?", "Prices", "Book an appointment"], ctx: c };
  }
  const chips = typeof best.chips === "function" ? best.chips(c) : best.chips;
  return { html: best.answer(c), chips, ctx: c };
}

// ---------------------------------------------------------------- chat widget
export function mountAssistant() {
  const root = document.getElementById("ellie");
  let ctx = {};
  let opened = false;
  root.innerHTML = `
    <button class="ellie-fab" id="ellieFab" aria-label="Chat with Ellie, Elevated's assistant"><img src="assets/img/logo-circle.png" alt="" /><span>Questions? <b>Ask Ellie</b></span></button>
    <section class="ellie-panel" id="elliePanel" role="dialog" aria-label="Chat with Ellie" hidden>
      <header><img src="assets/img/logo-circle.png" alt="" /><div><b>Ellie</b><small>Elevated's assistant · replies instantly</small></div><button class="ellie-x" id="ellieClose" aria-label="Close chat">×</button></header>
      <div class="ellie-log" id="ellieLog" aria-live="polite"></div>
      <div class="ellie-chips" id="ellieChips"></div>
      <form class="ellie-form" id="ellieForm"><input id="ellieIn" autocomplete="off" placeholder="Ask about services, prices, booking…" aria-label="Your message" /><button aria-label="Send">➤</button></form>
      <p class="ellie-note">Ellie answers from Elevated's own info. For medical advice, talk to your provider.</p>
    </section>`;
  const $ = (id) => document.getElementById(id);
  const log = $("ellieLog");
  const add = (who, html) => { const d = document.createElement("div"); d.className = `msg msg--${who}`; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
  const chips = (list) => { $("ellieChips").innerHTML = (list || []).map((c) => `<button type="button">${esc(c)}</button>`).join(""); };
  const ask = (text) => {
    if (!text.trim()) return;
    add("me", esc(text));
    chips([]);
    const typing = add("bot", `<span class="typing"><i></i><i></i><i></i></span>`);
    const r = reply(text, ctx);
    ctx = r.ctx;
    setTimeout(() => { typing.innerHTML = r.html; log.scrollTop = log.scrollHeight; chips(r.chips); }, 450 + Math.min(900, r.html.length * 1.2));
  };
  const open = () => {
    $("elliePanel").hidden = false; root.classList.add("is-open");
    if (!opened) { opened = true; add("bot", `Hi! I'm <b>Ellie</b> 👋 I know everything about Elevated Massage + Wellness: treatments, prices, first visits, cupping, insurance and booking. What can I help you with?`); chips(["What do you offer?", "Prices", "First visit", "I have back pain", "Book an appointment"]); }
    setTimeout(() => $("ellieIn").focus(), 50);
  };
  $("ellieFab").onclick = open;
  $("ellieClose").onclick = () => { $("elliePanel").hidden = true; root.classList.remove("is-open"); };
  $("ellieForm").onsubmit = (e) => { e.preventDefault(); const v = $("ellieIn").value; $("ellieIn").value = ""; ask(v); };
  $("ellieChips").onclick = (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); };
  log.addEventListener("click", (e) => { const a = e.target.closest("[data-open-service]"); if (a) { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-service", { detail: a.dataset.openService })); } });
  document.querySelectorAll("[data-ask]").forEach((b) => b.addEventListener("click", () => { open(); ask(b.dataset.ask); }));
  return { open, ask };
}
