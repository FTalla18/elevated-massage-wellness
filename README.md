# Elevated Massage + Wellness: website redesign (preview)

A modern, mobile-friendly redesign of [elevatedmassageandwellness.com](https://www.elevatedmassageandwellness.com/), built as a surprise preview. Not the official site (it's marked `noindex` so it never competes with the real one in search).

**Preview:** https://ftalla18.github.io/elevated-massage-wellness/

## What's inside
- Everything from the current site: About, all 11 services (each with full details), first-visit guide, FAQ, conditions, contraindications, community involvement, contact info and a contact form.
- **Real prices** from the clinic's Jane booking page, with every "Book" button going straight to Jane.
- **Ellie, the website assistant:** answers questions about services, prices, first visits, cupping, insurance, preparation, conditions ("can you help with sciatica?"), location and booking. It runs in the browser with no account, API key or monthly cost, and only answers from the clinic's own information. Anything it doesn't know goes to a phone/email handoff, and it flags safety topics (pregnancy, blood thinners, fever…) instead of guessing.
- Map, click-to-call, directions, gift cards (via Jane), and a contact form that opens the visitor's email app.

## Editing content
All business info lives in **`js/knowledge.js`** (services, prices, FAQ, conditions, about text). Change it once and both the page and Ellie update.

## Files
```
index.html           page layout
css/styles.css       design (brand navy + ocean blue, Fraunces + Manrope fonts)
js/knowledge.js      all business content (single source of truth)
js/assistant.js      Ellie, the chat assistant
js/main.js           renders sections, menus, service details, contact form
assets/img/          the clinic's own logo and photos (resized for the web)
tests/               ellie.html (question battery), shot.html (screenshots)
```

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
