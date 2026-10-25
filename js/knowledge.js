// Everything the website and the assistant know about Elevated Massage + Wellness.
// Sourced from elevatedmassageandwellness.com and the clinic's Jane booking page.
// Edit here and both the page and the chat update together.

export const BIZ = {
  name: "Elevated Massage + Wellness",
  tagline: "Medical massage for athletes, active lives, and everyone in between",
  phone: "727-280-6424",
  phoneHref: "tel:+17272806424",
  email: "info@elevatedmassageandwellness.com",
  address: "2772 66th St. N, Saint Petersburg, FL 33705",
  mapsQuery: "Elevated Massage + Wellness, 2772 66th St N, St. Petersburg, FL 33705",
  booking: "https://elevatedwellness.janeapp.com/",
  therapist: "Teresa Cherry",
  since: 2017,
};

const jane = (discipline, treatment) => `${BIZ.booking}#/discipline/${discipline}/treatment/${treatment}`;

// Prices and lengths from the live booking system.
export const PRICES = [
  { group: "Start here", items: [
    { name: "Initial Assessment (first visit)", mins: 90, price: 150, book: jane(1, 1), note: "Intake, goals, posture & range-of-motion review, plus your first treatment. Book this before any other treatment." },
  ] },
  { group: "Medical Sports Massage · injury & recovery", items: [
    { name: "60-minute treatment", mins: 60, price: 135, book: jane(1, 11), note: "A quick full-body recovery or 1–2 focus areas." },
    { name: "90-minute treatment", mins: 90, price: 175, book: jane(1, 3), note: "Thorough full-body recovery or pre-event work with 2–3 focus areas." },
    { name: "120-minute treatment", mins: 120, price: 225, book: jane(1, 5), note: "Full-body treatment with several focus areas." },
  ] },
  { group: "Medical Thai Massage", items: [
    { name: "Initial Assessment, Thai (first visit)", mins: 90, price: 150, book: jane(2, 7), note: "For new clients: intake plus treatment on a tatami floor mat, fully clothed." },
    { name: "90-minute session", mins: 90, price: 175, book: jane(2, 8), note: "Stretching, acupressure and deep tissue work along the sen lines." },
    { name: "120-minute session", mins: 120, price: 225, book: jane(2, 9), note: "A longer, deeper session for stubborn tension and mobility." },
  ] },
];

// Services (the old site had a page for each one).
export const SERVICES = [
  { id: "first-visit", name: "First Time Visit", img: "first-visit.jpg", targets: "Your goals, posture, gait & range of motion",
    lengths: "90 min · $150", short: "Book this before starting any other treatment.",
    body: [
      "Medical massage is a detailed, thorough approach to relieving pain and restoring or enhancing function. Every technique is done with deliberate intention, and the goal is always explained to you so progress can be tracked.",
      "Your first visit includes the intake process: we review the intake form that's emailed to you when you book, talk through your goals, and may do a posture and gait analysis or test your range of motion and muscle activation to build the bigger picture of your wellness priorities.",
      "After your first treatment, your therapist will help you set up a treatment plan if needed. Treatments are prioritized by pain and discomfort, with the goal of getting you past \"manageable\" and into a thriving state. That may mean more frequent visits at first, then tapering into maintenance.",
    ] },
  { id: "sports", name: "Sports Massage", img: "iastm-knee.jpg", targets: "Pre & post event or training · injury recovery",
    lengths: "60, 90 or 120 min · from $135", short: "Recovery, performance and injury care for athletes of every level.",
    body: [
      "Useful before and after a workout or competition. You and your therapist discuss your goals and build your care plan together.",
      "May include IASTM tools (instrument-assisted soft tissue work), stretching techniques, cupping, and athletic taping.",
      "Goals include preparing for or recovering from events, recovering between activities, healing athletic injuries, and preventative soft tissue care for optimum performance.",
    ] },
  { id: "neuromuscular", name: "Medical Neuromuscular Massage", img: "neuromuscular.jpg", targets: "Pain · dysfunction · injury · tension · stress",
    lengths: "60, 90 or 120 min", short: "Full-body, upper-body or lower-body focus for pain, numbness and restricted movement.",
    body: [
      "Addresses compensation issues, enhances circulation, and relieves headaches, restrictive movement, stress tension, body pain, tingling and numbness.",
      "May include IASTM tools, cupping and athletic taping. Choose a full-body, upper-body or lower-body concentration.",
    ] },
  { id: "cupping", name: "Cupping & IASTM", img: "cupping-back.jpg", targets: "Pain · circulation · tension · mobility · stress",
    lengths: "In sports & neuromuscular sessions, or stand-alone", short: "Certified medical cupping, including full \"blanket\" cupping sessions.",
    body: [
      "We're experts in medical cupping techniques and hold several certifications. Cupping relieves pain, increases mobility, helps with tight or stiff muscles, and increases oxygen, blood and lymphatic flow to speed recovery.",
      "We use medical-grade silicone, plastic, glass and biomagnetic cups, light or deep, moving (gliding) or stationary. Some techniques are slightly uncomfortable but give greater overall relief.",
      "Cupping can leave circular marks from light pink to dark purple depending on technique, tension, hydration and skin sensitivity. They usually aren't painful and fade completely within 5–10 days.",
      "A blanket cupping session uses many cups at once with a series of stretches for a large release that goes beyond fascia. Expect deep, lasting calm: plan time afterward to relax, meditate, nap or float.",
      "Prep: hydrate well for several days before. If you have photos or lots of sun coming up, plan around it or tell your therapist so marks can be avoided.",
    ] },
  { id: "thai", name: "Medical Thai Massage", img: "neck-release.jpg", targets: "Chronic pain · flexibility · joint stiffness · stress",
    lengths: "90 or 120 min · from $175", short: "Assisted stretching, acupressure and deep tissue work on a floor mat, fully clothed.",
    body: [
      "Also known as Thai therapeutic or Thai yoga massage: a holistic practice rooted in the idea that energy pathways (sen lines) can become blocked and cause discomfort.",
      "Performed on a comfortable tatami floor mat while you're fully clothed in loose, comfortable attire. Sessions start with gentle stretching and rhythmic compressions, then pressure along the sen lines using hands, thumbs, elbows and feet, with yoga-like stretches.",
      "Benefits: pain relief, improved flexibility and range of motion, deep stress reduction, better energy flow, and better posture and overall well-being. It's often used alongside other medical treatments to support faster healing.",
    ] },
  { id: "set", name: "SET Massage (Structural Energetic Therapy)", img: "set.jpg", targets: "Core causes of acute or chronic pain, stress, trauma & somatic holding",
    lengths: "90 or 120 min", short: "One integrated approach for structural, muscular and energetic alignment.",
    body: [
      "SET aims to support the highest functioning of all bodily systems through optimum structural, muscular and energetic alignment.",
      "It combines applied kinesiology and muscle testing, postural analysis, cranial/structural techniques, directed myofascial unwinding, emotional energy release, acupressure, scar tissue and adhesion release, and deep tissue therapy into one efficient approach.",
    ] },
  { id: "stretch", name: "Stretch Therapy", img: "stretch.jpg", targets: "Mobility · tension",
    lengths: "60 min", short: "Done clothed in relaxed fitness wear.",
    body: [
      "A series of specific stretches or a 1-hour full-body routine including full-range sports stretches, muscle energy technique, PNF, dynamic and passive stretching.",
      "Wear relaxed fitness attire. No oils, no undressing.",
    ] },
  { id: "breathwork", name: "Breathwork", img: "cupping-legs.jpg", targets: "Stress · emotional & energetic tension",
    lengths: "Ask for details", short: "Release stress and emotion stored in the body.",
    body: [
      "Ever notice how stress and emotions build up in the body and cause more tension or pain? This session is designed to clear holding patterns of emotional energy, stress and residual trauma stored in the body.",
      "As the body becomes highly oxygenated, other benefits can follow: decreased inflammation, cellular detox, a nervous system reset, more energy and endurance, and better mental clarity and focus. Reach out for details.",
    ] },
  { id: "kids", name: "Kids Sport Massage (ages 5–16)", img: "kids-sport.jpg", targets: "Posture · mobility · stress for growing, active kids",
    lengths: "60 min", short: "For young athletes, scholarship hopefuls, and busy, stressed-out kids.",
    body: [
      "Helps children with stress, performance, pain, discomfort, tension or injury recovery, with techniques adapted to their age and development. Includes guided breathing and body-awareness work.",
      "A waiver must be signed for all minors under 17. From age 16, any regular treatment can be booked.",
    ] },
  { id: "seniors", name: "Massage for Seniors (65+)", img: "seniors.jpg", targets: "Pain & ailments of an aging body",
    lengths: "60 min", short: "Range of motion, balance, circulation and vitality.",
    body: [
      "Focused on client-specific needs around recovery and aging: range of motion, balance, circulation, reaction time, tension and pain relief, and restoring physical and emotional vitality.",
      "Includes guided breathing and body-awareness work.",
    ] },
  { id: "neurodiverse", name: "Neurodiverse & Sensory-Sensitive Care", img: "head-release.jpg", targets: "Autism · hypersensitivity · touch sensitivity · motor disability",
    lengths: "Ask for details", short: "Thoughtful, adaptable sessions for sensory-sensitive clients.",
    body: [
      "Sessions designed for neurodiverse conditions, motor disability, hypersensitivity and touch sensitivity. Call or email to talk through what would make a session comfortable.",
    ] },
];

export const WHO_WE_HELP = ["Athletes", "Children", "People 65+", "Accidents & injury", "Mobility & function", "Chronic pain", "Somatic trauma", "Sensory-sensitive / autistic", "Neurological conditions", "Stress, tension & grief"];

export const CONDITIONS = [
  "back, neck or shoulder pain", "muscle spasms and muscle weakness", "jaw pain and dysfunction (TMJ)", "whiplash", "nerve injuries and entrapments",
  "carpal tunnel syndrome", "sciatica", "Parkinson's disease", "poor circulation", "tendinitis, tendinosis, bursitis, arthritis and osteoporosis",
  "cerebral palsy and Bell's palsy", "fibromyalgia", "emotional tension, stress, grief, anxiety and depression", "headaches and migraines",
  "scar tissue and surgical-site recovery", "degenerative, herniated or ruptured discs", "auto accident and sports injuries", "thoracic outlet syndrome",
  "restless leg syndrome", "eye strain", "tennis and golfer's elbow", "rotator cuff conditions", "joint pain, strains and pulls",
  "ankle and foot conditions, fallen arches, plantar fasciitis",
];

export const CONTRAINDICATIONS = ["fever", "acute injury or accident (less than 48 hours ago)", "dizziness or nausea", "deep bruises or open wounds", "rashes or severe sunburn", "a history of thrombosis (blood clots)", "intoxication, including narcotic pain medication", "certain circulatory medications, like blood thinners (please tell us)"];

export const FAQ = [
  { q: "How is medical massage different from a spa massage?", a: "Every type of massage helps in its own way, but medical massage is a detailed, thorough approach to relieving pain and restoring or enhancing function. Techniques are chosen with deliberate intention, and the goal is always explained to you so progress can be followed up." },
  { q: "How long are sessions?", a: "Treatments are usually 60 to 120 minutes. Many clients do 90 minutes to 2 hours. Your first visit is a 90-minute Initial Assessment." },
  { q: "When should I schedule, and how often?", a: "Your first visit includes an assessment of posture and range of motion. Afterward, your therapist helps you set a treatment plan if needed, and you can move to a maintenance cycle. Athletes benefit before and after events and hard workouts, and during rest and recovery. Benefits are cumulative: some athletes come several times a week, others weekly, bi-weekly or monthly. Ask about package discounts for consistent care." },
  { q: "What conditions do you help with?", a: "Massage is indicated for many conditions, including " + CONDITIONS.slice(0, 12).join(", ") + ", and more. Ask your therapist about anything not listed." },
  { q: "Is massage ever not recommended?", a: "Yes. Please reschedule or talk to us first if you have " + CONTRAINDICATIONS.join(", ") + ". If you have any condition or take medications, check with your primary healthcare provider first. Always disclose medical conditions; sometimes the session can be adapted. Ask your therapist if you need a doctor referral form." },
  { q: "Do you take insurance?", a: "Insurance isn't billed directly. If you're filing an injury claim (for example after an auto accident), you may be able to bill your services. Check with your attorney or insurance to verify coverage." },
  { q: "How should I prepare, and what should I do after?", a: "Before: come well hydrated, wear comfortable clothing, and plan to relax; steady deep breathing helps you get the best results. After: drink at least 16 oz of water and follow up with your therapist about your plan or next appointment." },
  { q: "Will cupping leave marks? Does it hurt?", a: "Cupping can leave circular marks from light pink to dark purple depending on technique, tension, hydration and skin sensitivity. They feel like nothing or a light soreness, usually aren't painful, and fade within 5–10 days. Hydrate for several days beforehand, and tell your therapist about upcoming photos or sun exposure." },
  { q: "Do you treat children?", a: "Yes! Ages 5 to 16, whether your child is very active, stressed, or recovering from an accident or injury. Sessions include guided breathing and body awareness. A waiver is required for minors under 17, and from 16 any regular treatment can be booked." },
  { q: "Do you offer massage for people over 65?", a: "Yes. Senior sessions focus on range of motion, balance, circulation, reaction time, tension and pain relief, and restoring physical and emotional vitality." },
  { q: "Do you support community events?", a: "Yes. Elevated offers massage and healing services to charitable events in Pinellas County for free or at a discounted rate, especially events serving the neurodiverse community, vulnerable or disabled populations, and veterans. Call 727-280-6424 or email info@elevatedmassageandwellness.com." },
];

export const ABOUT = {
  intro: "Elevated Massage + Wellness came to life from an intrinsic call to healing, a passion for athletics, and the desire to encourage whole-person wellness in our community.",
  story: "We first opened in February 2017 in St. Pete, specializing in athletic performance and recovery. Since then we've worked with thousands of local athletes of all ages and supported hundreds of community events, charities, small businesses and competitions across Tampa Bay. Our expertise has grown into injury rehab, movement enhancement and soft tissue recovery for non-sports pain too, working closely with a trusted network of gyms, trainers, doctors, physical therapists, acupuncturists and holistic providers.",
  mission: "Gold-star preventative and restorative care that's educational, personalized and aligned with lifelong health, so you're empowered beyond healing to optimize your total well-being.",
  practice: "Every practitioner follows the same intake and record-keeping process, so the focus stays on your goals and progress no matter who treats you. We're committed to continuing clinical education and bring 10+ years of combined healing work.",
};

export const TESTIMONIALS = [
  { quote: "After years of discomfort in my hands and forearms from my occupation, I am finally feeling massive relief after only a few sessions with Teresa. She is a very intuitive and knowledgeable therapist. HIGHLY RECOMMENDED.", by: "John" },
];
