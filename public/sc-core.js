'use strict';

// ═══════════════════════════════════════════════════════════
// WALLETS & INTEGRATIONS
// ═══════════════════════════════════════════════════════════
const SHERPA_WALLETS = {
  btc: 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad',
  lnTemp: 'TEMP-LIGHTNING-DO-NOT-SEND@sherpacarta.temp.giveabit.io',
  lnUrl: null,
  silentPayments: null,
  /** Public registry (single source of truth for status/treasury). Load optional. */
  registryUrl: '/data/wallets.json',
};
window.SHERPA_WALLETS = SHERPA_WALLETS;
// Optional: hydrate live Lightning / Silent Payments from wallets.json without rebuild
fetch(SHERPA_WALLETS.registryUrl, { cache: 'no-cache' })
  .then((r) => (r.ok ? r.json() : null))
  .then((w) => {
    if (!w) return;
    if (w.bitcoin?.address) SHERPA_WALLETS.btc = w.bitcoin.address;
    if (w.lightning?.status === 'live') {
      const live = w.lightning.lud16 || w.lightning.lnurl || w.lightning.address;
      if (live) {
        SHERPA_WALLETS.lnUrl = live;
        SHERPA_WALLETS.lnTemp = live;
        if (typeof window.applyLiveLightning === 'function') window.applyLiveLightning(live);
        else {
          document.querySelectorAll('.pay-warning').forEach((el) => el.remove());
          ['donate-ln-address', 'footer-ln-address'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.textContent = live;
          });
        }
      }
    }
    if (w.silentPayments?.address) SHERPA_WALLETS.silentPayments = w.silentPayments.address;
  })
  .catch(() => {});
const SATOHASH_URL = 'https://satohash.giveabit.io';
const NOSTR_RELAYS = ['wss://relay.damus.io','wss://nos.lol','wss://relay.snort.social'];
const CONTACT_EMAIL = 'hello@giveabit.io';
const CONTACT_SUBJECT = 'Sherpacarta';
const NOSTR_NIP05 = 'kimi@giveabit.io';
let qrCurrentAddress = '';
let qrCurrentType = 'btc';

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
const state = {
  signers: JSON.parse(localStorage.getItem('sc_signers')||'[]'),
  signCount: (function(){
    const signers = JSON.parse(localStorage.getItem('sc_signers')||'[]');
    const stored = parseInt(localStorage.getItem('sc_count')||'0', 10);
    // Honest baseline: local signatures only (migrate old inflated seed 4271)
    if (stored >= 4000 && signers.length < 50) return signers.length;
    return Number.isFinite(stored) ? stored : signers.length;
  })(),
  theme: localStorage.getItem('sc_theme')||'dark',
  lang: localStorage.getItem('sc_lang')||'en',
  readingAloud: false,
  utterance: null,
  ambientOn: false,
  quoteIndex: 0,
  quoteTimer: null,
  nostrPubkey: localStorage.getItem('sc_nostr_pk')||null,
  amendments: JSON.parse(localStorage.getItem('sc_amendments')||'[]'),
  charterHash: localStorage.getItem('sc_charter_hash')||null,
};
if(state.theme==='light') document.documentElement.setAttribute('data-theme','light');

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS (Feature 40 — Top 5 World Languages)
// ═══════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    heroH1: 'A <span class="accent">Magna Carta</span><br>for the Digital Age',
    heroSub: 'Privacy as a Fundamental Human Right. A living charter for every person on Earth — enforceable, editable, and evolving.',
    ctaCharter: 'Open the Full Charter',
    ctaSign: 'Sign & Assert Rights',
    langName: '🇬🇧 English',
  },
  zh: {
    heroH1: '数字时代的<span class="accent">大宪章</span>',
    heroSub: '隐私权是基本人权。一份为全球每一个人制定的活文件——可执行、可编辑、持续演进。',
    ctaCharter: '打开完整宪章',
    ctaSign: '签署并主张权利',
    langName: '🇨🇳 中文',
  },
  es: {
    heroH1: 'Una <span class="accent">Carta Magna</span><br>para la Era Digital',
    heroSub: 'La privacidad como derecho humano fundamental. Una carta viva para cada persona en la Tierra — aplicable, editable y en evolución.',
    ctaCharter: 'Abrir la Carta Completa',
    ctaSign: 'Firmar y Afirmar Derechos',
    langName: '🇪🇸 Español',
  },
  ar: {
    heroH1: 'الماغنا كارتا<br>للعصر <span class="accent">الرقمي</span>',
    heroSub: 'الخصوصية حق إنساني أساسي. ميثاق حيّ لكل إنسان على وجه الأرض — قابل للتطبيق والتعديل والتطور.',
    ctaCharter: 'فتح الميثاق الكامل',
    ctaSign: 'توقيع والمطالبة بالحقوق',
    langName: '🇸🇦 العربية',
  },
  fr: {
    heroH1: 'Une <span class="accent">Magna Carta</span><br>pour l\'Ère Numérique',
    heroSub: 'La vie privée comme droit humain fondamental. Une charte vivante pour chaque personne sur Terre — applicable, modifiable et en évolution.',
    ctaCharter: 'Ouvrir la Charte Complète',
    ctaSign: 'Signer et Affirmer les Droits',
    langName: '🇫🇷 Français',
  },
};

function switchNavLang(lang) {
  state.lang = lang;
  localStorage.setItem('sc_lang', lang);
  applyTranslation(lang);
}

function applyTranslation(lang) {
  const t = TRANSLATIONS[lang];
  if(!t) return;
  const h1 = document.getElementById('hero-heading');
  const sub = document.getElementById('hero-sub');
  const ctaC = document.getElementById('cta-charter-text');
  const ctaS = document.getElementById('cta-sign-text');
  if(h1) h1.innerHTML = t.heroH1;
  if(sub) sub.textContent = t.heroSub;
  if(ctaC) ctaC.textContent = t.ctaCharter;
  if(ctaS) ctaS.textContent = t.ctaSign;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  toast(`Language: ${t.langName}`, 'info');
}

// Apply saved or URL language on load
window.addEventListener('DOMContentLoaded', () => {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  const lang = (urlLang && TRANSLATIONS[urlLang]) ? urlLang : state.lang;
  if(lang !== 'en') {
    state.lang = lang;
    document.getElementById('nav-lang').value = lang;
    applyTranslation(lang);
  }
});

// ═══════════════════════════════════════════════════════════
// CHARTER DATA
// ═══════════════════════════════════════════════════════════
window.CHARTER = [
  {
    "chapter": "Preamble",
    "articles": [
      {
        "num": "P.1",
        "title": "On the Foundation of Rights",
        "subtitle": "Basis of all SherpaCarta Articles",
        "body": "We, the people of the interconnected world, recognize that the digital revolution has created powers capable of surveilling, silencing, and controlling human life at unprecedented scale. Just as Magna Carta constrained the arbitrary power of kings in 1215, and just as the Universal Declaration of Human Rights bound nations after 1948, SherpaCarta binds all who exercise digital power—states, corporations, algorithms, and platforms alike.<br><br>These articles are not aspirational. They are the minimum standards of human dignity in the digital age. They apply to every human being who connects to any network, uses any digital device, or generates any form of digital data—regardless of nationality, income, gender, race, religion, or political belief.",
        "sherpa": true,
        "sherpa_ext": "Unlike all predecessor documents, SherpaCarta acknowledges that the primary threats to digital rights come not only from states but from private corporations whose market capitalization exceeds the GDP of most nations. Both are bound equally by these articles.",
        "tags": [
          "foundation",
          "history"
        ]
      }
    ]
  },
  {
    "chapter": "Chapter I — Foundational Rights",
    "articles": [
      {
        "num": "Art. 1",
        "title": "Human Dignity in Digital Spaces",
        "subtitle": "The Inviolability of the Person Online",
        "body": "Every person possesses inherent dignity that extends fully into digital spaces. No person may be subjected to digital humiliation, algorithmic dehumanization, automated discrimination, or systematic exclusion from digital life on the basis of any personal characteristic.<br><br>Digital identity is an extension of the human person and shall be treated with the same protections as physical identity.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": [
          "dignity",
          "foundation"
        ]
      },
      {
        "num": "Art. 2",
        "title": "Equality Before Digital Law",
        "subtitle": "Universal Application Without Exception",
        "body": "All persons are equal before the digital law. No state, platform, or algorithm shall treat persons differently on the basis of: nationality, ethnicity, religion, gender, sexual orientation, age, disability, political opinion, socioeconomic status, or technical literacy.<br><br>Algorithmic systems that produce discriminatory outcomes—whether intentional or emergent—violate this article regardless of the technical mechanism producing the discrimination.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": [
          "equality",
          "non-discrimination"
        ]
      },
      {
        "num": "Art. 3",
        "title": "Right to Digital Existence",
        "subtitle": "No Person May Be Digitally Erased Against Their Will",
        "body": "Every person has the right to digital existence: the right to maintain a verifiable digital identity, access digital services essential to modern life, and participate in digital society without requiring surrender of fundamental rights as a condition of participation.<br><br>No entity may permanently and without recourse delete, deactivate, or deny access to a person's primary means of digital communication or economic participation.",
        "sherpa": true,
        "sherpa_ext": "Platform bans of individuals must follow due process equivalent to civil legal proceedings. Permanent bans require judicial-equivalent review.",
        "tags": [
          "access",
          "existence"
        ]
      },
      {
        "num": "Art. 4",
        "title": "Freedom from Digital Servitude",
        "subtitle": "No Coerced Labor Through Platforms",
        "body": "No person shall be compelled to perform unpaid digital labor—content moderation, data labeling, training data contribution, or attention harvesting—as a condition of accessing essential digital services.<br><br>Terms of service that require users to surrender intellectual property, perpetual license to personal content, or mandatory participation in surveillance economies as price of admission are void ab initio.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 5",
        "title": "Right to Informed Digital Citizenship",
        "subtitle": "Understanding the Systems That Govern You",
        "body": "Every person has the right to understand, in plain language, how digital systems affecting their rights operate—including algorithms that rank, recommend, moderate, price, or exclude them.<br><br>States and corporations must publish citizen-readable explanations of digital governance systems. Technical complexity is not a shield against accountability.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 6",
        "title": "Protection of Minors in Digital Spaces",
        "subtitle": "Childhood Cannot Be Monetized",
        "body": "Children and adolescents possess enhanced digital rights protections. Profiling, behavioral advertising, and data collection targeting minors is prohibited without explicit parental consent and independent child-welfare review.<br><br>Design features that exploit developmental vulnerability—infinite scroll, variable reward mechanics, social comparison pressure—shall not be deployed in services primarily used by minors.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 7",
        "title": "Right to Digital Sanctuary",
        "subtitle": "Spaces Free from Commercial Surveillance",
        "body": "Every person has the right to digital spaces free from commercial surveillance, behavioral tracking, and attention extraction—whether in education, healthcare, worship, grief, or intimate communication.<br><br>Sanctuary spaces must be technically enforced, not merely promised in privacy policies.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 8",
        "title": "Prohibition of Digital Caste Systems",
        "subtitle": "No Permanent Digital Underclass",
        "body": "No system shall permanently classify persons into tiers of digital access, creditworthiness, social visibility, or civic participation based on past behavior, associations, or algorithmic scores without recourse.<br><br>Digital caste—permanent exclusion from employment, housing, finance, or civic life through unappealable digital markers—is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 9",
        "title": "Right to Technological Literacy",
        "subtitle": "Education as Prerequisite for Sovereignty",
        "body": "States have a positive obligation to ensure all persons can understand, configure, and defend their digital rights. Digital literacy is a component of basic education equivalent to reading and numeracy.<br><br>No person shall be deemed to have waived rights through ignorance of technology.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 10",
        "title": "Binding of Private Power",
        "subtitle": "Corporations Are Bound Equally With States",
        "body": "Any entity whose digital systems affect more than one million persons—whether state, corporation, or platform—is bound by SherpaCarta with equal force.<br><br>Market capitalization, user count, or technical sophistication does not confer immunity from human rights obligations.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter II — Privacy & Data Sovereignty",
    "articles": [
      {
        "num": "Art. 11",
        "title": "Right to Privacy",
        "subtitle": "The Cornerstone Article — Absolute Protection from Surveillance",
        "body": "Every person has the right to privacy in their communications, data, identity, location, associations, beliefs, and online behavior. This right is absolute and may not be limited except by specific judicial order in pursuit of a specific, named criminal investigation, with the least invasive method available, for the shortest possible duration.<br><br>Mass surveillance—the collection of data on persons not individually suspected of specific crimes—is prohibited under all circumstances. No emergency, national security concern, or commercial interest justifies mass surveillance of the population.",
        "sherpa": true,
        "sherpa_ext": "\"Privacy by Design\" is mandatory for all systems processing personal data. Privacy must be the default state, not an opt-in feature. Any system that by default shares more data than necessary violates this article.",
        "tags": [
          "privacy",
          "surveillance",
          "core"
        ]
      },
      {
        "num": "Art. 12",
        "title": "Data Sovereignty",
        "subtitle": "You Own Your Data — Without Exception",
        "body": "All data generated by or about a person belongs to that person. This includes: browsing history, purchase history, location data, biometric data, behavioral patterns, communications metadata, health data, financial data, and any data that can be used to identify, profile, or predict the behavior of an individual.<br><br>The right to data sovereignty includes: the right to access all data held about oneself, the right to correct inaccurate data, the right to delete data (right to erasure), the right to transfer data between services (portability), and the right to monetize one's own data.",
        "sherpa": true,
        "sherpa_ext": "Data sovereignty is heritable. Upon death, a person's digital data rights transfer to their designated heirs or, absent designation, are deleted within 2 years.",
        "tags": [
          "data",
          "ownership",
          "sovereignty"
        ]
      },
      {
        "num": "Art. 13",
        "title": "Prohibition of Surveillance Capitalism",
        "subtitle": "Your Attention and Behavior May Not Be Sold Without Consent",
        "body": "The commercial model of tracking individuals' behavior without meaningful consent and selling that behavioral data to third parties for advertising or political purposes is hereby designated as a violation of human dignity.<br><br>Consent to data collection must be: freely given (not a condition of service access), specific (not blanket authorization), informed (plain language, not legalese), and withdrawable at any time without penalty.",
        "sherpa": true,
        "sherpa_ext": "\"Dark patterns\"—interface designs that manipulate users into consenting to data collection—are prohibited. Any consent obtained through manipulative design is void.",
        "tags": [
          "advertising",
          "tracking"
        ]
      },
      {
        "num": "Art. 14",
        "title": "Right to Communications Secrecy",
        "subtitle": "Private Messages Stay Private",
        "body": "The content and metadata of private communications shall not be accessed, stored, analyzed, or disclosed without specific judicial authorization naming the individual and the crime under investigation.<br><br>End-to-end encryption is a human right. No state or corporation may mandate backdoors in secure communications systems available to the general public.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 15",
        "title": "Biometric Data Protection",
        "subtitle": "Your Body Is Not a Password for Corporations",
        "body": "Biometric identifiers—face, voice, gait, retina, DNA-derived markers—may not be collected without informed consent, may not be sold, and must be deletable on demand.<br><br>Biometric surveillance in public spaces requires democratic authorization through referendum or supermajority legislative vote, renewed every two years.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 16",
        "title": "Location Privacy",
        "subtitle": "Where You Go Is Your Business",
        "body": "Continuous location tracking of persons not individually suspected of specific crimes is prohibited. Location data belongs to the person who generates it.<br><br>Aggregated mobility data may not be sold to third parties. Historical location data must be deletable within 30 days of request.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 17",
        "title": "Prohibition of Shadow Profiles",
        "subtitle": "You Cannot Be Profiled Without Knowledge",
        "body": "Creating profiles of persons who are not users of a service—through data broker aggregation, social graph inference, or cross-platform tracking—is prohibited.<br><br>Every person has the right to know if a profile exists about them and to demand its deletion.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 18",
        "title": "Health Data Sovereignty",
        "subtitle": "Medical Data Is Sacred",
        "body": "Health, genetic, and disability data receive the highest protection tier. No commercial use without explicit opt-in renewed annually. No sharing with insurers, employers, or governments without judicial order.<br><br>Health apps and wearables must operate in local-first mode by default, with cloud sync as opt-in only.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 19",
        "title": "Financial Data Privacy",
        "subtitle": "Your Money Trail Is Private",
        "body": "Transaction data, credit behavior, and financial metadata belong exclusively to the person who generates them. Open banking APIs must be person-initiated, not institution-initiated.<br><br>Financial surveillance of populations not individually suspected of crimes is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 20",
        "title": "Right to Anonymous Digital Participation",
        "subtitle": "Pseudonymity Is Not Suspicion",
        "body": "Every person has the right to participate in digital society under pseudonym without forfeiting rights or facing presumption of criminal intent.<br><br>States may not require real-name registration for general internet access, social participation, or political expression.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter III — Expression & Access",
    "articles": [
      {
        "num": "Art. 21",
        "title": "Freedom of Digital Expression",
        "subtitle": "The Right to Speak Online Without Fear",
        "body": "Every person has the right to freedom of expression in digital spaces. This right includes the freedom to hold opinions without interference and to seek, receive, and impart information and ideas through any digital medium regardless of frontiers.<br><br>Platform content moderation must be: transparent, consistent, non-discriminatory, based on published and publicly debated standards, subject to meaningful appeal, and never based on political viewpoint without due process.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": [
          "expression",
          "censorship",
          "speech"
        ]
      },
      {
        "num": "Art. 22",
        "title": "Universal Internet Access",
        "subtitle": "Connectivity as Infrastructure — Like Water and Electricity",
        "body": "Access to a free, open, and uncensored internet is a fundamental human right equivalent to access to water, electricity, and education. No person shall be denied internet access as a form of punishment, economic sanction, or political control.<br><br>States and corporations have a positive obligation to expand internet access to all populations, prioritizing marginalized and rural communities. Internet shutdowns ordered by governments are prohibited under this charter.",
        "sherpa": true,
        "sherpa_ext": "Internet service providers are common carriers. They may not block, throttle, or prioritize any lawful internet traffic. Net neutrality is a human rights issue.",
        "tags": [
          "access",
          "internet",
          "infrastructure"
        ]
      },
      {
        "num": "Art. 23",
        "title": "Net Neutrality as Human Right",
        "subtitle": "All Bits Are Equal",
        "body": "Internet service providers and platforms shall not block, throttle, prioritize, or degrade lawful traffic based on source, destination, content, or commercial relationship.<br><br>Zero-rating schemes that create tiered internet access based on corporate partnerships violate this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 24",
        "title": "Right to Platform Due Process",
        "subtitle": "Bans Require Justice, Not Moderator Whim",
        "body": "Permanent exclusion from platforms exceeding one million users requires: published rules, specific violation citation, meaningful appeal to independent review, and proportionality assessment.<br><br>Shadow-banning, reach suppression without notification, and demonetization without appeal violate due process.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 25",
        "title": "Protection of Whistleblowers",
        "subtitle": "Truth Needs Courage and Shield",
        "body": "Persons who disclose evidence of digital rights violations, mass surveillance, or corporate malfeasance receive SherpaCarta safe harbor protection from retaliation.<br><br>Encryption tools for whistleblower communication shall not be criminalized.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 26",
        "title": "Right to Receive Information",
        "subtitle": "The Right to Read Is the Right to Know",
        "body": "No state or platform may block access to lawful information based on political viewpoint. Filtering must be user-controlled, transparent, and off by default.<br><br>Internet shutdowns and DNS blocking of news sources are prohibited under all circumstances except named judicial orders against specific illegal content.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 27",
        "title": "Journalist and Researcher Protections",
        "subtitle": "Investigation Requires Independence",
        "body": "Journalists, researchers, and civil society investigators have enhanced protections for data access, source confidentiality, and freedom from platform retaliation when reporting in the public interest.<br><br>Scraping publicly available data for accountability research is a protected activity.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 28",
        "title": "Cultural and Linguistic Expression",
        "subtitle": "No Language Is a Second Class Online",
        "body": "Digital platforms must support equitable access for all languages and writing systems. Automated translation must not replace human cultural expression rights.<br><br>Minority language communities have the right to digital presence without algorithmic demotion.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 29",
        "title": "Right to Satire and Parody",
        "subtitle": "Mockery of Power Is Protected Speech",
        "body": "Satire, parody, and political caricature directed at states, corporations, and public figures are protected expression. Automated content moderation must not remove satire without human review.<br><br>SLAPP suits and strategic litigation against digital critics are discouraged and subject to accelerated dismissal.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 30",
        "title": "Academic and Scientific Freedom Online",
        "subtitle": "Knowledge Cannot Be Paywalled by Censorship",
        "body": "Academic research, scientific preprints, and educational materials may not be suppressed by corporate or state pressure. Open access to publicly funded research is mandatory.<br><br>Researchers have the right to publish findings about algorithmic harm without prior platform approval.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter IV — Identity & Consent",
    "articles": [
      {
        "num": "Art. 31",
        "title": "Self-Sovereign Identity",
        "subtitle": "You Control Who You Are Online",
        "body": "Every person has the right to create, control, and revoke digital identities without dependency on any single corporation or state registry.<br><br>Decentralized identity standards must be supported by public services. No monopoly identity provider shall be mandated.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 32",
        "title": "Meaningful Consent",
        "subtitle": "Silence Is Not Agreement",
        "body": "Consent to data processing must be granular, revocable, and obtained through affirmative action—not pre-checked boxes, dark patterns, or continued use after buried policy changes.<br><br>Bundled consent covering unrelated purposes is void.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 33",
        "title": "Right to Disconnect",
        "subtitle": "You May Log Off Without Penalty",
        "body": "No employer, platform, or service may penalize persons for declining always-on connectivity, after-hours messaging, or perpetual availability.<br><br>Right to disconnect is enforceable against gig economy platforms and remote work surveillance.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 34",
        "title": "Prohibition of Coerced Biometric Enrollment",
        "subtitle": "Your Face Is Not a Ticket",
        "body": "Biometric identification may not be required for access to housing, employment, education, healthcare, or public transportation.<br><br>Alternative non-biometric access methods must always be available at equal convenience.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 35",
        "title": "Digital Will and Succession",
        "subtitle": "Your Digital Life Outlives You With Dignity",
        "body": "Every person may designate digital heirs, deletion instructions, and memorial preferences. Platforms must honor digital wills within 30 days.<br><br>Commercial use of deceased persons' data without heir consent is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 36",
        "title": "Right to Gender Identity Online",
        "subtitle": "Self-Identification Is Sovereign",
        "body": "Persons have the right to define and change their gender identity in digital systems without medical gatekeeping, platform verification hurdles, or algorithmic misgendering.<br><br>Deadnaming and forced outing through platform design violate this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 37",
        "title": "Neurodiversity and Accessibility by Design",
        "subtitle": "Different Minds, Equal Rights",
        "body": "Digital systems must accommodate cognitive, sensory, and neurological differences as default—not as afterthought accessibility patches.<br><br>Autoplay, infinite scroll, and notification bombardment must be off by default.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 38",
        "title": "Prohibition of Emotional Manipulation",
        "subtitle": "Interfaces Must Not Weaponize Psychology",
        "body": "Design patterns that exploit fear, urgency, guilt, or social pressure to extract consent, purchases, or engagement are prohibited.<br><br>A/B testing on vulnerable populations without ethics review violates this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 39",
        "title": "Right to Digital Intimacy",
        "subtitle": "Private Relationships Are Not Training Data",
        "body": "Communications between intimate partners, families, and confidential counselors may not be used for advertising, AI training, or behavioral profiling.<br><br>End-to-end encrypted family and health messaging receives absolute protection.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 40",
        "title": "Age-Appropriate Design Defaults",
        "subtitle": "Safety First for the Young",
        "body": "All digital services likely to be accessed by minors must default to highest privacy settings, no profiling, no behavioral advertising, and no contact from unknown adults.<br><br>Age verification systems must not create surveillance databases of minors.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter V — Data Governance & Erasure",
    "articles": [
      {
        "num": "Art. 41",
        "title": "Data Minimization Mandate",
        "subtitle": "Collect Only What You Need",
        "body": "Data collection must be limited to what is strictly necessary for the stated purpose. Purpose creep—using data collected for one reason for another—is prohibited without fresh consent.<br><br>Annual data minimization audits are mandatory for entities processing data on more than 100,000 persons.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 42",
        "title": "Right to Data Portability",
        "subtitle": "Take Your Data and Leave",
        "body": "Every person may export all personal data in machine-readable, open-standard formats within 30 days of request, free of charge.<br><br>Portability must include content, metadata, social graphs, and algorithmic inferences made about the person.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 43",
        "title": "Prohibition of Data Laundering",
        "subtitle": "You Cannot Sell What You Stole",
        "body": "Data obtained without meaningful consent may not be laundered through mergers, sublicensing, anonymization claims, or synthetic reconstruction.<br><br>Data brokers must maintain chain-of-consent documentation auditable by any data subject.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 44",
        "title": "Research Data Ethics",
        "subtitle": "Science Serves Humanity",
        "body": "Research use of personal data requires ethics board approval, informed consent, and right of withdrawal. Public interest research on algorithmic harm receives safe harbor.<br><br>IRB standards apply to corporate AI research on human subjects.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 45",
        "title": "Right to Human Review",
        "subtitle": "No Fully Automated Life Decisions",
        "body": "Decisions significantly affecting housing, employment, credit, healthcare, education, liberty, or immigration must include meaningful human review upon request.<br><br>Fully automated rejection without appeal path violates this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 46",
        "title": "Data Protection Impact Assessments",
        "subtitle": "Measure Harm Before Deployment",
        "body": "High-risk data processing requires public impact assessments before launch, including consultation with affected communities.<br><br>Post-deployment harm discovered triggers mandatory remediation within 90 days.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 47",
        "title": "Right to Be Forgotten",
        "subtitle": "The Right to a Digital Fresh Start",
        "body": "Every person has the right to have digital records of past actions removed from public and commercial databases when those records no longer serve a legitimate public interest proportionate to the individual's right to privacy and dignity.<br><br>This right applies especially to: criminal records for which sentences have been served, youthful indiscretions, data collected during vulnerability, and information posted under duress.",
        "sherpa": true,
        "sherpa_ext": "Search engines must comply with erasure requests within 72 hours. Non-compliance is a per-day violation. Historical archives may preserve information but must de-index it from public search.",
        "tags": [
          "erasure",
          "forgetting",
          "fresh-start"
        ]
      },
      {
        "num": "Art. 48",
        "title": "Collective Data Rights",
        "subtitle": "Communities Own Community Data",
        "body": "Indigenous nations, local communities, and defined groups have collective data sovereignty over information about their members, lands, and cultural practices.<br><br>Extractive data harvesting from marginalized communities without benefit-sharing is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 49",
        "title": "Open Public Data",
        "subtitle": "Government Data Belongs to Citizens",
        "body": "Non-sensitive government data must be published in open formats by default. Citizens have the right to access data about decisions affecting them.<br><br>Trade secret claims may not shield public safety or rights-violation data.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 50",
        "title": "Sunset Clauses on Data Retention",
        "subtitle": "Data Must Expire",
        "body": "Personal data must be deleted when the purpose for collection expires, unless specific legal retention applies. Default maximum retention: two years for behavioral data, five years for transactional records.<br><br>Indefinite retention without justification violates this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter VI — Security & Encryption",
    "articles": [
      {
        "num": "Art. 51",
        "title": "Right to Strong Encryption",
        "subtitle": "Math Is Not a Crime",
        "body": "Every person has the right to use strong encryption without restriction. States may not ban, weaken, or mandate backdoors in encryption available to the public.<br><br>Export controls on encryption tools violate this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 52",
        "title": "Security by Default",
        "subtitle": "Unsafe Systems Are Defective Products",
        "body": "Software and hardware must ship with security enabled by default: automatic updates, secure defaults, minimal attack surface.<br><br>Vendors liable for foreseeable harm from negligent security design.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 53",
        "title": "Responsible Disclosure Protection",
        "subtitle": "Security Researchers Are Allies",
        "body": "Good-faith security research and vulnerability disclosure receive safe harbor. Criminalizing security research harms everyone.<br><br>Vendors must acknowledge reports within 5 business days.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 54",
        "title": "Breach Notification",
        "subtitle": "You Must Be Told When You Are Hacked",
        "body": "Data breaches affecting personal information must be disclosed to affected persons within 72 hours, with remediation steps and accountability measures.<br><br>Delayed disclosure to protect stock prices is an aggravating factor.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 55",
        "title": "Right to Offline Functionality",
        "subtitle": "Cloud Failure Must Not Erase Life",
        "body": "Essential digital services must provide offline-capable alternatives. Dependence on perpetual connectivity for access to personal data violates sovereignty.<br><br>Local-first architecture is the preferred design pattern.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 56",
        "title": "Prohibition of Preemptive Device Compromise",
        "subtitle": "Your Phone Is Not a Surveillance Endpoint",
        "body": "States may not require manufacturers to pre-install surveillance software on consumer devices. Supply chain integrity is a human right.<br><br>Citizen devices may not be remotely accessed without judicial warrant.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 57",
        "title": "Digital Infrastructure Resilience",
        "subtitle": "Critical Systems Must Survive Attack",
        "body": "States and operators of critical digital infrastructure must maintain redundancy, incident response, and public reporting of major outages affecting rights.<br><br>Ransomware payment from public funds requires transparency review.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 58",
        "title": "Open Source Security Preference",
        "subtitle": "Transparency Builds Trust",
        "body": "Public sector procurement must prefer auditable open-source solutions where security-equivalent. Security through obscurity is not a defense.<br><br>Source code for systems processing public data should be publicly reviewable.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 59",
        "title": "Right to Verify Software Integrity",
        "subtitle": "You May Audit What Runs on Your Device",
        "body": "Persons have the right to verify that software on their devices matches published source code through reproducible builds and code signing.<br><br>Tamper-evident boot and user-controlled root of trust are protected.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 60",
        "title": "Cyber Peace Principles",
        "subtitle": "Digital War Has Civilian Casualties",
        "body": "Offensive cyber operations against civilian infrastructure violate this charter. Critical healthcare, water, power, and financial systems are protected digital spaces.<br><br>Nation-state malware hoarding without disclosure endangers global security.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter VII — Algorithmic Rights",
    "articles": [
      {
        "num": "Art. 61",
        "title": "Right to Algorithmic Transparency",
        "subtitle": "You Have the Right to Know How Machines Judge You",
        "body": "Every person has the right to a meaningful explanation of any automated decision that significantly affects their life—including credit decisions, insurance pricing, job application screening, content moderation, law enforcement risk scoring, and medical recommendations.<br><br>\"Meaningful explanation\" requires more than technical documentation. It requires a plain-language account of what factors were used, what weight they were given, and what the person could do to alter the outcome.",
        "sherpa": true,
        "sherpa_ext": "No person may be denied fundamental rights (housing, employment, healthcare, education, credit) solely on the basis of automated decision-making. Human review must always be available.",
        "tags": [
          "AI",
          "algorithms",
          "transparency"
        ]
      },
      {
        "num": "Art. 62",
        "title": "Protection from Algorithmic Discrimination",
        "subtitle": "Algorithmic Bias is Discrimination — Full Stop",
        "body": "Algorithmic systems that produce discriminatory outcomes—whether through biased training data, discriminatory feature selection, or emergent behavior—are in violation of this charter regardless of the intent of their creators.<br><br>Operators of algorithmic systems that make decisions affecting human rights must conduct regular bias audits, publish results, remediate discovered biases within defined timeframes, and compensate persons who can demonstrate harm.",
        "sherpa": true,
        "sherpa_ext": "Facial recognition systems used for law enforcement without judicial warrant are prohibited. Predictive policing systems are prohibited.",
        "tags": [
          "AI",
          "discrimination",
          "bias"
        ]
      },
      {
        "num": "Art. 63",
        "title": "Prohibition of Manipulative Algorithms",
        "subtitle": "Your Feed Must Not Be a Weapon",
        "body": "Recommendation and ranking algorithms may not be designed to maximize addiction, outrage, or compulsive engagement at the expense of user wellbeing.<br><br>Users must have chronological and algorithm-free feed options on platforms exceeding 10 million users.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 64",
        "title": "Right to Opt Out of Profiling",
        "subtitle": "You Are Not a Prediction",
        "body": "Every person may opt out of behavioral profiling, interest inference, and psychographic targeting without loss of core service functionality.<br><br>Profiling opt-out must be as easy as profiling opt-in.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 65",
        "title": "AI Training Data Consent",
        "subtitle": "Your Life Is Not Free Training Data",
        "body": "Use of personal data, creative works, or communications to train AI systems requires explicit opt-in consent, with fair compensation mechanisms for commercial use.<br><br>Scraping copyrighted or personal content for model training without consent is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 66",
        "title": "Synthetic Media Labeling",
        "subtitle": "Deepfakes Must Be Identified",
        "body": "AI-generated media presented as factual must be clearly labeled. Non-consensual intimate synthetic imagery is prohibited.<br><br>Political deepfakes during election periods face enhanced penalties.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 67",
        "title": "Human Oversight of High-Risk AI",
        "subtitle": "Machines Advise, Humans Decide",
        "body": "High-risk AI systems—those affecting liberty, health, or livelihood—require human-in-the-loop oversight, kill switches, and incident logging.<br><br>Autonomous weapons systems targeting humans are prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 68",
        "title": "Algorithmic Impact Audits",
        "subtitle": "Test Before You Deploy on Millions",
        "body": "Deployers of algorithmic systems affecting more than 100,000 persons must publish annual bias, accuracy, and harm audits.<br><br>Third-party auditors must have access sufficient to verify claims.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 69",
        "title": "Right to Contest Automated Decisions",
        "subtitle": "Challenge the Machine",
        "body": "Every automated adverse decision must include a clear pathway to human review, correction, and explanation within 14 days.<br><br>Class action rights apply to systematic algorithmic harm.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 70",
        "title": "Open Algorithm Standards",
        "subtitle": "Public Interest Algorithms Deserve Public Scrutiny",
        "body": "Algorithms used in public services, elections, and judicial support must use open, auditable standards. Trade secret protection does not apply to public-sector algorithms.<br><br>Citizens may request algorithmic audits of government systems.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter VIII — Platform Accountability",
    "articles": [
      {
        "num": "Art. 71",
        "title": "Duty of Care for Platforms",
        "subtitle": "Size Brings Responsibility",
        "body": "Platforms exceeding 10 million active users owe a duty of care to prevent foreseeable harm—including harassment campaigns, viral misinformation with physical consequences, and exploitation of minors.<br><br>Immunity from liability does not extend to willful indifference.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 72",
        "title": "Interoperability Rights",
        "subtitle": "You May Leave and Take Your Network",
        "body": "Dominant platforms must provide interoperable APIs enabling users to communicate across platforms and export social graphs.<br><br>Walled gardens that lock in users through network effects violate this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 73",
        "title": "Prohibition of Self-Preferencing",
        "subtitle": "The Referee Cannot Play",
        "body": "Platforms may not prioritize their own products in search, recommendations, or app stores in ways that harm competitors.<br><br>App store monopolies must allow alternative payment and distribution.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 74",
        "title": "Advertising Transparency",
        "subtitle": "You May Know Who Paid to Influence You",
        "body": "All digital political and commercial advertising must disclose funder identity, targeting criteria, and spend. Microtargeting based on sensitive categories is prohibited.<br><br>Ad archives must be publicly searchable for seven years.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 75",
        "title": "Worker Rights in the Gig Economy",
        "subtitle": "Algorithmic Bosses Owe Fairness",
        "body": "Gig workers have the right to know how algorithms set pay, assign work, and terminate accounts. Opaque algorithmic management is prohibited.<br><br>Minimum wage and safety standards apply regardless of platform classification.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 76",
        "title": "Right to Repair and Modify",
        "subtitle": "You Own Your Devices",
        "body": "Digital locks, DRM, and terms of service may not prevent persons from repairing, modifying, or repurposing devices they own.<br><br>Right to repair extends to software and firmware.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 77",
        "title": "Prohibition of Dark Patterns",
        "subtitle": "Honest Design Only",
        "body": "User interfaces that trick, coerce, or manipulate users into actions against their interest are prohibited. Regulatory fines scale with conversion rate of dark patterns.<br><br>Canceling subscriptions must be as easy as starting them.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 78",
        "title": "Collective Bargaining for Users",
        "subtitle": "Users May Organize",
        "body": "Users of dominant platforms have the right to organize, collectively negotiate terms of service, and appoint ombudspersons without retaliation.<br><br>Platform union busting violates this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 79",
        "title": "Environmental Disclosure of AI",
        "subtitle": "Compute Has a Carbon Cost",
        "body": "Operators of large AI systems must disclose energy consumption and carbon footprint. Public sector AI procurement must consider environmental impact.<br><br>Water usage for data centers in drought regions requires community consent.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 80",
        "title": "Anti-Monopoly Digital Markets",
        "subtitle": "Competition Is a Right",
        "body": "States must prevent digital market monopolies through structural separation, data portability mandates, and prohibition of killer acquisitions.<br><br>Merger review must assess data concentration risk.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter IX — State & Governance",
    "articles": [
      {
        "num": "Art. 81",
        "title": "Limits on State Digital Surveillance",
        "subtitle": "Governments Serve Citizens, Not the Reverse",
        "body": "State digital surveillance requires judicial warrant naming individuals and crimes. Mass surveillance programs are prohibited regardless of national security claims.<br><br>Surveillance budgets must be publicly disclosed annually.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 82",
        "title": "Digital Due Process",
        "subtitle": "The Fourth Amendment Applies Online",
        "body": "Search of digital devices, cloud accounts, and communications requires the same due process as physical search. Border device searches require probable cause.<br><br>Parallel construction from illegal surveillance is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 83",
        "title": "Prohibition of Social Credit Systems",
        "subtitle": "Citizens Are Not Scores",
        "body": "Government or corporate systems that rank citizens for access to services, travel, or rights based on behavioral scoring are prohibited.<br><br>Reputation systems without appeal and correction rights violate this article.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 84",
        "title": "E-Government Transparency",
        "subtitle": "Public Services Must Be Open",
        "body": "Government digital services must be open source where security allows, accessible without proprietary software, and usable offline where feasible.<br><br>Citizens may not be forced onto single-vendor platforms for civic participation.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 85",
        "title": "Digital Voting Integrity",
        "subtitle": "Democracy Requires Verifiable Systems",
        "body": "Electronic voting must be auditable, recountable, and open to independent verification. Online-only voting without paper backup is prohibited for national elections.<br><br>Voter data may not be used for non-electoral purposes.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 86",
        "title": "Protection from Extraterritorial Overreach",
        "subtitle": "No Empire in the Cloud",
        "body": "States may not assert jurisdiction over foreign persons' data without treaty basis and proportionality. Cloud providers must resist unlawful foreign data orders.<br><br>Data localization requirements must respect human rights.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 87",
        "title": "Digital Rights Ombudsman",
        "subtitle": "Every Nation Needs an Advocate",
        "body": "States shall establish independent digital rights ombudspersons with authority to investigate complaints, issue binding recommendations, and refer violations for prosecution.<br><br>Ombudspersons must be funded independently of surveillance agencies.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 88",
        "title": "Prohibition of Forced Device Access",
        "subtitle": "Passwords Stay With the Person",
        "body": "States may not compel persons to disclose encryption passwords, device passcodes, or biometric unlock except with judicial order in specific criminal investigations.<br><br>Contempt charges for silence protected where self-incrimination applies.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 89",
        "title": "Public Interest Digital Defense",
        "subtitle": "Legal Aid for Digital Rights",
        "body": "States must fund legal aid for persons pursuing digital rights claims against powerful entities.<br><br>Public interest litigation receives fee-shifting when rights violations are proven.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 90",
        "title": "Democratic Oversight of Spyware",
        "subtitle": "Pegasus Has Victims",
        "body": "Government purchase and use of commercial spyware requires legislative approval, judicial oversight, and public annual reporting of targets and outcomes.<br><br>Zero-day stockpiling by governments endangers global security.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter X — Global & Cross-Border",
    "articles": [
      {
        "num": "Art. 91",
        "title": "Universal Jurisdiction for Digital Harm",
        "subtitle": "Borders Do Not Block Justice",
        "body": "Courts may exercise jurisdiction over digital rights violations affecting their residents regardless of where the violating entity is headquartered.<br><br>Victims may sue in their home jurisdiction.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 92",
        "title": "Data Transfer Adequacy",
        "subtitle": "Your Data Cannot Be Exported to Surveillance States",
        "body": "Transfer of personal data to jurisdictions without adequate privacy protections is prohibited unless person-initiated and informed.<br><br>Adequacy assessments must be public and revocable.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 93",
        "title": "Global Digital Rights Treaty Framework",
        "subtitle": "SherpaCarta as Model Law",
        "body": "Nations are encouraged to adopt SherpaCarta articles as binding national law through treaty, legislation, or constitutional amendment.<br><br>International monitoring body recommended for compliance reporting.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 94",
        "title": "Protection of Digital Refugees",
        "subtitle": "Exile From Digital Life Deserves Sanctuary",
        "body": "Persons persecuted for digital expression have the right to seek asylum. States must not deport persons to jurisdictions where digital persecution is likely.<br><br>VPN and encryption tools for refugees must not be restricted.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 95",
        "title": "Development Rights Online",
        "subtitle": "The Global South Must Not Be Digital Colonies",
        "body": "Developing nations have the right to digital infrastructure sovereignty, local data storage, and freedom from extractive data colonialism.<br><br>Technology transfer and open standards support required from dominant nations.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 96",
        "title": "Multilingual Internet Governance",
        "subtitle": "ICANN Serves Humanity",
        "body": "Internet governance institutions must reflect global demographic diversity. English-only policy development is insufficient.<br><br>Nations may establish multilingual root governance participation.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 97",
        "title": "Cross-Border Evidence Protocols",
        "subtitle": "Justice Without Data Raids",
        "body": "Cross-border digital evidence requests must follow treaty procedures with proportionality review. Bulk data requests are prohibited.<br><br>Mutual legal assistance must not become mass surveillance pipeline.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 98",
        "title": "Sanctions and Digital Rights",
        "subtitle": "Punish Regimes, Not People",
        "body": "Sanctions may not block access to communication tools, encryption, or human rights documentation for civilian populations.<br><br>General license for digital rights tools in sanctioned regions required.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 99",
        "title": "Corporate Extraterritorial Accountability",
        "subtitle": "Multinationals Answer to All They Harm",
        "body": "Corporations operating globally are accountable in every jurisdiction where they cause digital rights harm, regardless of incorporation location.<br><br>Forum shopping to evade liability is prohibited.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 100",
        "title": "Solidarity Among Signatories",
        "subtitle": "A Global Movement, Not a Website",
        "body": "Signatories to SherpaCarta form a global solidarity network obligated to support one another's digital rights advocacy, translation, and legal defense.<br><br>Local chapters may form with autonomy under charter principles.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      }
    ]
  },
  {
    "chapter": "Chapter XI — Enforcement & Remedies",
    "articles": [
      {
        "num": "Art. 101",
        "title": "Right to Digital Remedy",
        "subtitle": "Every Violation Entitles the Victim to Remedy",
        "body": "Every person whose rights under this charter are violated is entitled to an effective remedy. The right to remedy is not diminished by the technical complexity of the violation, the geographical distance of the perpetrator, or the commercial power of the violating entity.<br><br>Remedies shall include: cessation of the violating behavior, restoration of the violated right, compensation for harm suffered, and systemic changes to prevent future violations.",
        "sherpa": true,
        "sherpa_ext": "Digital rights violations affecting more than 1,000 individuals constitute public interest violations and may be pursued by any signatory organization on behalf of the affected class.",
        "tags": [
          "remedy",
          "enforcement",
          "justice"
        ]
      },
      {
        "num": "Art. 102",
        "title": "Class Action and Collective Redress",
        "subtitle": "Millions Harmed, One Lawsuit",
        "body": "Systematic digital rights violations affecting groups qualify for collective redress without requiring each victim to litigate individually.<br><br>Representative actions by civil society organizations are authorized.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 103",
        "title": "Punitive Damages for Willful Violations",
        "subtitle": "Profit Must Not Exceed Penalty",
        "body": "Willful, repeated, or profit-motivated digital rights violations face punitive damages up to 4% of global annual revenue.<br><br>Executive personal liability applies for directed violations.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 104",
        "title": "Injunctive Relief",
        "subtitle": "Stop the Harm First",
        "body": "Courts may issue immediate injunctions halting ongoing digital rights violations without requiring victims to prove damages first.<br><br>Temporary restraining orders available within 48 hours for surveillance emergencies.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 105",
        "title": "Whistleblower Rewards",
        "subtitle": "Incentivize Truth",
        "body": "Persons who expose systematic digital rights violations may receive a portion of recovered damages or fines.<br><br>Retaliation against whistleblowers triggers automatic investigation.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 106",
        "title": "Public Enforcement Actions",
        "subtitle": "Regulators Must Act",
        "body": "Data protection authorities must investigate credible complaints within 30 days and publish outcomes. Regulatory capture is an actionable violation.<br><br>Underfunded enforcement is not an excuse for inaction.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 107",
        "title": "Sunset of Immunity Provisions",
        "subtitle": "Section 230 Must Evolve",
        "body": "Platform liability immunity does not extend to willful facilitation of trafficking, exploitation, or systematic rights violations with actual knowledge.<br><br>Immunity frameworks must be reviewed every five years.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 108",
        "title": "Victim Compensation Funds",
        "subtitle": "Harm Creates Obligation to Repair",
        "body": "Fines from digital rights violations fund victim compensation pools administered transparently.<br><br>Priority to marginalized communities disproportionately harmed.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 109",
        "title": "International Enforcement Cooperation",
        "subtitle": "Justice Without Borders",
        "body": "Nations shall cooperate in enforcement against digital rights violators through information sharing, asset freezing, and extradition where appropriate.<br><br>Safe havens for digital rights violators should be eliminated through treaty.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 110",
        "title": "Charter Supremacy Clause",
        "subtitle": "Rights Over Profits",
        "body": "When SherpaCarta conflicts with commercial contracts, terms of service, or trade agreements, the charter prevails to the extent of the conflict.<br><br>Waivers of fundamental digital rights in adhesion contracts are void.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 111",
        "title": "Signatory Registry",
        "subtitle": "Public Record of Commitment",
        "body": "Organizations and governments adopting SherpaCarta must register publicly, report compliance annually, and accept community review.<br><br>False adoption claims are actionable misrepresentation.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 112",
        "title": "Education and Enforcement Funding",
        "subtitle": "Rights Require Resources",
        "body": "States adopting SherpaCarta commit to funding digital rights education, legal aid, and enforcement at minimum 0.1% of digital economy GDP.<br><br>Private signatories contribute proportionally to revenue.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 113",
        "title": "Non-Regression Principle",
        "subtitle": "Rights Never Go Backward",
        "body": "No law, policy, or terms of service may reduce digital rights below SherpaCarta baseline once adopted.<br><br>Regression triggers automatic review and public hearing.",
        "sherpa": false,
        "sherpa_ext": null,
        "tags": []
      },
      {
        "num": "Art. 114",
        "title": "Living Charter Principle",
        "subtitle": "This Document Grows With Technology",
        "body": "SherpaCarta is a living document. Technology evolves faster than legal frameworks. Therefore, this charter shall be reviewed annually by a global council of signatories, legal experts, technologists, civil society representatives, and affected communities.<br><br>Amendments may be proposed by any signatory, debated publicly for 90 days, and ratified by two-thirds supermajority of active signatory organizations. No amendment may reduce the protections of any existing article. Rights may only expand, never contract.",
        "sherpa": true,
        "sherpa_ext": "Final Principle: If any provision of this charter conflicts with the commercial interests of any entity, the charter prevails. Commerce serves humanity. Humanity does not serve commerce.",
        "tags": [
          "living",
          "amendment",
          "evolution"
        ]
      }
    ]
  }
];

const CHARTER = window.CHARTER;

const KEY_ARTICLES = CHARTER.flatMap(ch => ch.articles);

// ═══════════════════════════════════════════════════════════
// LANGUAGES LIST
// ═══════════════════════════════════════════════════════════
const LANGUAGES = ['English','Español','Français','Deutsch','中文','العربية','Português','Русский','日本語','한국어','Italiano','Nederlands','Polski','Svenska','Norsk','Suomi','Dansk','Íslenski','Türkçe','हिन्दी','বাংলা','Swahili','Hausa','Yoruba','Zulu','Amharic','Tagalog','Bahasa','Tiếng Việt','ภาษาไทย','Монгол','فارسی','Shqip','Čeština','Română','Magyar','Slovenčina','Srpskohrvatski','Ελληνικά','Українська'];

// ═══════════════════════════════════════════════════════════
// SEED SIGNERS
// ═══════════════════════════════════════════════════════════
const SEED_SIGNERS = [
  {name:'Björn Eriksson',c:'🇸🇪'},{name:'Aiko Tanaka',c:'🇯🇵'},{name:'Priya Sharma',c:'🇮🇳'},
  {name:'Carlos Mendez',c:'🇲🇽'},{name:'Fatima Al-Rashid',c:'🇦🇪'},{name:'James Okafor',c:'🇳🇬'},
  {name:'Elena Kowalski',c:'🇵🇱'},{name:'Lars Andersen',c:'🇩🇰'},{name:'Amara Diallo',c:'🇸🇳'},
  {name:'Yuki Watanabe',c:'🇯🇵'},{name:'Sophie Müller',c:'🇩🇪'},{name:'Ali Hassan',c:'🇪🇬'},
  {name:'Mei Lin',c:'🇨🇳'},{name:'Thomas Osei',c:'🇬🇭'},{name:'Natasha Ivanova',c:'🇷🇺'},
  {name:'David Cohen',c:'🇮🇱'},{name:'Amina Berber',c:'🇲🇦'},{name:'Luca Romano',c:'🇮🇹'},
  {name:'Astrid Svensson',c:'🇸🇪'},{name:'Chen Wei',c:'🇹🇼'},{name:'Oluwaseun A.',c:'🇳🇬'},
  {name:'Ana Ferreira',c:'🇧🇷'},{name:'Hamid Karimi',c:'🇮🇷'},{name:'Ingrid Halvorsen',c:'🇳🇴'},
];

// ═══════════════════════════════════════════════════════════
// QUOTES (Feature 41)
// ═══════════════════════════════════════════════════════════
const QUOTES = [
  {text:"Privacy is not something that I'm merely entitled to, it's an absolute prerequisite.", author:"Marlon Brando"},
  {text:"The right to be left alone is the most comprehensive of rights, and the right most valued by civilized men.", author:"Justice Louis Brandeis, 1928"},
  {text:"Surveillance is the business model of the internet.", author:"Bruce Schneier"},
  {text:"If you have nothing to hide, you have nothing to fear is the slogan of every surveillance state that has ever existed.", author:"Edward Snowden"},
  {text:"The internet is the greatest tool for human liberation ever created. It will be used that way if we insist on it.", author:"Lawrence Lessig"},
  {text:"Privacy is not about having something to hide. Privacy is about dignity, autonomy, and the power to be the author of your own story.", author:"SherpaCarta Preamble"},
  {text:"Arguing that you don't care about privacy because you have nothing to hide is no different from saying you don't care about free speech because you have nothing to say.", author:"Edward Snowden"},
  {text:"The internet interprets censorship as damage and routes around it.", author:"John Gilmore, 1993"},
  {text:"Data is the new oil. But unlike oil, data grows when shared. Ownership of data is not zero-sum—it is the basis of a new commons.", author:"SherpaCarta Article 12 Commentary"},
  {text:"We are not fighting for the internet of today. We are fighting for the internet that should have been, and still can be.", author:"SherpaCarta Article 114"},
];

let quoteTimer;
function buildQuoteDots() {
  const dots = document.getElementById('quote-dots');
  if(!dots) return;
  dots.innerHTML = QUOTES.map((_,i)=>`<div onclick="goToQuote(${i})" style="width:6px;height:6px;border-radius:50%;background:${i===0?'var(--em)':'var(--border2)'};cursor:none;transition:background .2s"></div>`).join('');
}
function updateQuoteDots(idx) {
  const dots = document.querySelectorAll('#quote-dots div');
  dots.forEach((d,i)=>d.style.background=i===idx?'var(--em)':'var(--border2)');
}
function showQuote(idx) {
  const qt = document.getElementById('quote-text');
  const qa = document.getElementById('quote-author');
  if(!qt||!qa) return;
  qt.style.opacity='0'; qa.style.opacity='0';
  setTimeout(()=>{
    qt.textContent = `"${QUOTES[idx].text}"`;
    qa.textContent = `— ${QUOTES[idx].author}`;
    qt.style.opacity='1'; qa.style.opacity='1';
    updateQuoteDots(idx);
  },400);
}
function nextQuote(){
  state.quoteIndex=(state.quoteIndex+1)%QUOTES.length;
  showQuote(state.quoteIndex);
  resetQuoteTimer();
}
function prevQuote(){
  state.quoteIndex=(state.quoteIndex-1+QUOTES.length)%QUOTES.length;
  showQuote(state.quoteIndex);
  resetQuoteTimer();
}
function goToQuote(i){state.quoteIndex=i;showQuote(i);resetQuoteTimer();}
function resetQuoteTimer(){clearInterval(quoteTimer);quoteTimer=setInterval(nextQuote,7000);}
function initQuotes(){buildQuoteDots();resetQuoteTimer();}

// ═══════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════
const cursorEl = document.getElementById('cursor');
const cursorRingEl = document.getElementById('cursor-ring');
let cx=0,cy=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  cx=e.clientX;cy=e.clientY;
  cursorEl.style.left=cx+'px';cursorEl.style.top=cy+'px';
});
function animateCursorRing(){
  rx+=(cx-rx)*.14;ry+=(cy-ry)*.14;
  cursorRingEl.style.left=rx+'px';cursorRingEl.style.top=ry+'px';
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();
document.addEventListener('mousedown',()=>{cursorEl.style.transform='translate(-50%,-50%) scale(.7)'});
document.addEventListener('mouseup',()=>{cursorEl.style.transform='translate(-50%,-50%) scale(1)'});

// ═══════════════════════════════════════════════════════════
// READING PROGRESS + SCROLL
// ═══════════════════════════════════════════════════════════
window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('progress-bar').style.width=(window.scrollY/max*100)+'%';
  document.getElementById('main-nav').classList.toggle('shrunk',window.scrollY>60);
  const fa=document.getElementById('float-assert');
  const bt=document.getElementById('back-top');
  fa.style.display=window.scrollY>500?'flex':'none';
  bt.style.display=window.scrollY>500?'flex':'none';
},{passive:true});

// ═══════════════════════════════════════════════════════════
// REVEAL ON SCROLL
// ═══════════════════════════════════════════════════════════
const revealEls=document.querySelectorAll('.reveal');
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target);}});
},{threshold:.07});
revealEls.forEach(el=>revObs.observe(el));

// ═══════════════════════════════════════════════════════════
// COUNT-UP
// ═══════════════════════════════════════════════════════════
function animateCount(el){
  const target=parseInt(el.dataset.count);
  const dur=2000,step=target/(dur/16);let cur=0;
  const t=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=Math.floor(cur).toLocaleString();if(cur>=target)clearInterval(t);},16);
}
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCount(e.target);cntObs.unobserve(e.target);}});
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cntObs.observe(el));

// ═══════════════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════════════
(function(){
  const canvas=document.getElementById('particle-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,particles=[],mx=-9999,my=-9999;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  window.addEventListener('resize',resize,{passive:true});resize();
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  canvas.addEventListener('mouseleave',()=>{mx=my=-9999;});
  for(let i=0;i<62;i++)particles.push({x:Math.random()*1600,y:Math.random()*900,vx:(Math.random()-.5)*.26,vy:(Math.random()-.5)*.26,r:Math.random()*1.6+.35,o:Math.random()*.55+.18});
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      // subtle mouse repulsion for premium feel
      const dx=(p.x*W/1600)-mx, dy=(p.y*H/900)-my;
      const dist=Math.hypot(dx,dy)||1;
      if(dist<160){
        const f=(160-dist)/160*0.9;
        p.vx+= (dx/dist)*f*0.018;
        p.vy+= (dy/dist)*f*0.018;
      }
      p.x+=p.vx; p.y+=p.vy;
      p.vx*=0.985; p.vy*=0.985;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x*W/1600,p.y*H/900,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(16,185,129,${p.o})`;ctx.shadowColor='#10b981';ctx.shadowBlur=6;ctx.fill();ctx.shadowBlur=0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ═══════════════════════════════════════════════════════════
// MAP CANVAS
// ═══════════════════════════════════════════════════════════
(function(){
  const canvas=document.getElementById('map-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  const clusters=[
    {cx:.15,cy:.35,r:.08},{cx:.25,cy:.55,r:.06},{cx:.5,cy:.28,r:.1},{cx:.52,cy:.45,r:.07},
    {cx:.6,cy:.32,r:.07},{cx:.78,cy:.33,r:.08},{cx:.82,cy:.55,r:.05},{cx:.43,cy:.62,r:.05},
    {cx:.3,cy:.38,r:.05},{cx:.88,cy:.48,r:.04},{cx:.19,cy:.45,r:.04},{cx:.65,cy:.58,r:.04},
  ];
  for(let i=0;i<200;i++){
    const cl=clusters[Math.floor(Math.random()*clusters.length)];
    const angle=Math.random()*Math.PI*2,dist=Math.random()*cl.r;
    const x=(cl.cx+Math.cos(angle)*dist)*W;
    const y=(cl.cy+Math.sin(angle)*dist)*H+20;
    const intensity=Math.random();
    ctx.beginPath();ctx.arc(x,y,1.5+Math.random()*3,0,Math.PI*2);
    ctx.fillStyle=`rgba(16,185,129,${.15+intensity*.85})`;
    if(intensity>.75){ctx.shadowColor='#10b981';ctx.shadowBlur=8;}
    ctx.fill();ctx.shadowBlur=0;
  }
})();

// ═══════════════════════════════════════════════════════════
// ARTICLES BROWSER
// ═══════════════════════════════════════════════════════════
const AI_SUMMARIES=[
  "This preamble establishes SherpaCarta's historic context, positioning it as the successor to Magna Carta and UDHR—but uniquely binding on corporations as well as states, acknowledging that digital power now rivals sovereign power.",
  "Article 1 extends human dignity protections into digital spaces, making algorithmic dehumanization legally equivalent to physical assault on personhood.",
  "Article 2 establishes strict equality before digital law, making algorithmic discrimination illegal even when emergent rather than intentional—a major advance over existing frameworks.",
  "Article 3 creates a new right: digital existence. You cannot be permanently erased from digital life without judicial-equivalent due process. This directly challenges platform deplatforming.",
  "Article 11 is the cornerstone. It makes mass surveillance unconstitutional under all circumstances—including national security—and establishes Privacy by Design as the mandatory default.",
  "Article 12 establishes that you own your data—legally and completely. This creates property rights in personal data, making its unauthorized commercial use a form of theft.",
  "This article names surveillance capitalism as a violation of human dignity. Consent obtained through dark patterns or service-denial is void—a radical departure from current regulatory practice.",
  "Article 47 creates a meaningful right to be forgotten, with 72-hour enforcement windows for search engines. This extends GDPR's framework globally and adds real teeth.",
  "Article 21 protects digital speech from platform censorship by requiring transparent, consistent, and politically neutral moderation standards subject to appeal.",
  "Article 22 establishes internet access as a utility equivalent to water. Government internet shutdowns are explicitly prohibited—with global enforcement implications.",
  "Article 61 creates the right to a plain-language explanation of any automated decision affecting your life. 'Black box' AI decision-making violates this article.",
  "Article 62 makes algorithmic discrimination illegal regardless of intent. Facial recognition in law enforcement and predictive policing are explicitly banned.",
  "Article 101 ensures technical complexity cannot shield violators. Every digital rights violation entitles the victim to an effective remedy.",
  "The final article establishes SherpaCarta as a living document—rights can only expand, never contract. The most significant procedural innovation in rights document history.",
];

function buildArticlesBrowser(){
  const sidebar=document.getElementById('articles-sidebar');
  const main=document.getElementById('articles-main');
  sidebar.innerHTML='';main.innerHTML='';
  let i=0;
  CHARTER.forEach((ch)=>{
    const hdr=document.createElement('div');
    hdr.className='article-chapter-hdr';
    hdr.style.cssText='padding:.45rem 1rem;font-size:.52rem;color:var(--em2);font-family:var(--mono);background:var(--bg3);position:sticky;top:0;z-index:1;letter-spacing:.06em;text-transform:uppercase';
    hdr.textContent=ch.chapter.replace(/^Chapter [^—]+ — /,'');
    sidebar.appendChild(hdr);
    ch.articles.forEach((art)=>{
    const idx=i;
    const tab=document.createElement('div');
    tab.className='article-tab'+(idx===0?' active':'');
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-selected',idx===0?'true':'false');
    tab.setAttribute('tabindex','0');
    tab.innerHTML=`<span class="art-num">${art.num}</span>${art.title}`;
    const activate=()=>{
      document.querySelectorAll('.article-tab').forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false');});
      document.querySelectorAll('.article-display').forEach(d=>d.classList.remove('active'));
      tab.classList.add('active');tab.setAttribute('aria-selected','true');
      const panel=document.getElementById('art-'+idx);
      if(panel){
        panel.classList.add('active');
        // Mobile: bring article body into view below the tab list
        if(window.matchMedia('(max-width:900px)').matches){
          panel.scrollIntoView({behavior:'smooth',block:'nearest'});
        }
      }
    };
    tab.addEventListener('click',activate);
    tab.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
    sidebar.appendChild(tab);
    const signed=JSON.parse(localStorage.getItem('sc_art_signed_'+idx)||'false');
    const div=document.createElement('div');
    div.className='article-display'+(idx===0?' active':'');
    div.id='art-'+idx;
    div.setAttribute('role','tabpanel');
    const bodyHtml=String(art.body||'').replace(/\n\n/g,'</p><p>');
    const safeTitle=(art.title||'').replace(/'/g,"\\'").replace(/"/g,'&quot;');
    div.innerHTML=`
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap">
        <div style="flex:1"><div class="art-title">${art.title||''}</div><div class="art-subtitle">${art.num||''}${art.sherpa?' · SherpaCarta Extension':''}</div></div>
        ${art.sherpa?'<span class="art-tag" style="background:rgba(16,185,129,.15);border-color:var(--em)">SHERPA EXT.</span>':''}
      </div>
      <div class="art-body"><p>${bodyHtml}</p></div>
      ${art.sherpa_ext?`<div class="ca-sherpa"><strong>SHERPACARTA EXTENSION</strong>${art.sherpa_ext}</div>`:''}
      <div class="art-tags">${(art.tags||[]).map(t=>`<span class="art-tag">#${t}</span>`).join('')}</div>
      <div class="art-actions">
        <button class="art-action-btn${signed?' signed':''}" id="sign-art-${idx}" onclick="signArticle(${idx})"><i class="fas fa-signature"></i> ${signed?'Signed ✓':'Sign this article'}</button>
        <button class="art-action-btn" onclick="shareArticle('${safeTitle}')"><i class="fas fa-share-nodes"></i> Share</button>
        <button class="art-action-btn" onclick="aiSummarize(${idx})"><i class="fas fa-sparkles"></i> AI Summary</button>
        <button class="art-action-btn" onclick="copyArticle(${idx})"><i class="fas fa-copy"></i> Copy</button>
      </div>
      <div class="ai-spinner" id="ai-spin-${idx}">✦ Generating summary...</div>
      <div class="ai-result" id="ai-res-${idx}"></div>
    `;
    main.appendChild(div);
    i++;
    });
  });
}

function signArticle(i){
  if(JSON.parse(localStorage.getItem('sc_art_signed_'+i)||'false')){toast('You already signed this article','info');return;}
  localStorage.setItem('sc_art_signed_'+i,'true');
  const btn=document.getElementById('sign-art-'+i);
  btn.classList.add('signed');btn.innerHTML='<i class="fas fa-check"></i> Signed ✓';
  toast('Article signed! Your assertion is recorded.','success');
}
function shareArticle(title){
  const txt=`I just signed "${title}" in the SherpaCarta — the Global Digital Magna Carta. Privacy is a human right. #SherpaCarta #DigitalRights`;
  if(navigator.share)navigator.share({title:'SherpaCarta',text:txt,url:window.location.href});
  else{navigator.clipboard.writeText(txt);toast('Share text copied!','success');}
}
function copyArticle(i){
  navigator.clipboard.writeText(document.querySelector('#art-'+i+' .art-body').textContent);
  toast('Article text copied','success');
}
function aiSummarize(i){
  const spin=document.getElementById('ai-spin-'+i),res=document.getElementById('ai-res-'+i);
  if(res.classList.contains('visible')){res.classList.remove('visible');spin.classList.remove('visible');return;}
  spin.classList.add('visible');res.classList.remove('visible');
  setTimeout(()=>{
    spin.classList.remove('visible');
    res.textContent=AI_SUMMARIES[i]||'This article establishes fundamental digital rights protections that extend existing legal frameworks.';
    res.classList.add('visible');
  },1100);
}

// ═══════════════════════════════════════════════════════════
// RIGHTS CALCULATOR
// ═══════════════════════════════════════════════════════════
const SCORES={country:{eu:85,us:55,uk:65,cn:5,ru:10,ca:75,in:50,au:60,br:65,ng:40,xx:3},use:{social:50,journalism:30,finance:60,business:65,medical:70,political:25},enc:{none:20,basic:50,e2e:80,full:100}};
const VERDICTS=[[0,20,'CRITICAL RISK — Extremely vulnerable. Immediate action required.'],[21,40,'HIGH RISK — Significantly compromised. Act now.'],[41,60,'MODERATE RISK — Partial protection. Significant gaps remain.'],[61,75,'REASONABLE — Above average but insufficient for sensitive activities.'],[76,90,'GOOD — Strong protections. Keep improving.'],[91,100,'EXCELLENT — Exercising full digital rights under SherpaCarta standards.']];
const RECS={cn:['Use Tor or VPN at all times','Use Signal for all communications','Document any violations for SherpaCarta advocacy'],xx:['Prioritize anonymous browsing','Signal for all comms','Seek SherpaCarta emergency advocacy'],none:['Switch to Signal immediately','Enable HTTPS-only mode','Use a no-log VPN'],basic:['Enable E2E encryption on messaging','Use ProtonMail for email','Consider a no-log VPN'],journalism:['Use SecureDrop for sensitive comms','Encrypt all devices','Use pseudonyms for digital advocacy'],political:['Use Tor Browser','Signal for all comms','Never use real name online in hostile jurisdictions']};

function calcRights(){
  const c=document.getElementById('calc-country').value,u=document.getElementById('calc-use').value,e=document.getElementById('calc-enc').value;
  if(!c||!u||!e)return;
  const score=Math.min(100,Math.round((SCORES.country[c]+SCORES.use[u]+SCORES.enc[e])/3));
  document.getElementById('calc-score').textContent=score+'/100';
  document.getElementById('rights-fill').style.width=score+'%';
  const v=VERDICTS.find(v=>score>=v[0]&&score<=v[1]);
  document.getElementById('calc-verdict').textContent=v?v[2]:'';
  const recs=RECS[c]||RECS[e]||RECS[u]||['Strengthen encryption','Use open-source tools','Know your rights under SherpaCarta'];
  document.getElementById('calc-recs').style.display='block';
  document.getElementById('calc-recs-list').innerHTML=recs.map(r=>`<div>• ${r}</div>`).join('');
}

// ═══════════════════════════════════════════════════════════
// SIGNERS
// ═══════════════════════════════════════════════════════════
function buildSigners(){
  const wall=document.getElementById('signers-wall');
  // Show real local signatures first; decorative seeds only if wall empty
  const local=state.signers||[];
  const all=local.length?local:SEED_SIGNERS.slice(0,6).map(s=>({...s,name:s.name+' · example'}));
  if(wall) wall.innerHTML=all.map(s=>`<div class="signer-pill">${s.c||''} ${s.name}</div>`).join('')+(local.length?'':'<div class="signer-pill" style="border-style:dashed">Be the first on this device</div>');
  const countEl=document.getElementById('sign-count');if(countEl)countEl.textContent=state.signCount.toLocaleString();
  const lc=document.getElementById('live-counter');if(lc)lc.textContent=state.signCount.toLocaleString();
  const ss=document.getElementById('signer-stat');if(ss){ss.textContent=state.signCount.toLocaleString();ss.dataset.count='';}
}

function signCharter(){
  const name=document.getElementById('sign-name').value.trim(),country=document.getElementById('sign-country').value.trim();
  if(!name){toast('Please enter your name or pseudonym','error');return;}
  if(state.signers.find(s=>s.name===name)){toast('You have already signed','info');return;}
  const flags={'United Kingdom':'🇬🇧','Canada':'🇨🇦','USA':'🇺🇸','United States':'🇺🇸','Australia':'🇦🇺','Germany':'🇩🇪','France':'🇫🇷','Japan':'🇯🇵','Brazil':'🇧🇷','India':'🇮🇳','China':'🇨🇳','Iceland':'🇮🇸','Nigeria':'🇳🇬'};
  const c=flags[country]||'🌐';
  state.signers.push({name,c});state.signCount++;
  localStorage.setItem('sc_signers',JSON.stringify(state.signers));
  localStorage.setItem('sc_count',state.signCount);
  localStorage.setItem('sc_last_signer',name);
  buildSigners();
  document.getElementById('sign-name').value='';document.getElementById('sign-country').value='';
  toast(`Welcome, ${name}! You are signatory #${state.signCount.toLocaleString()}.`,'success');
  // Animate counter
  const lc=document.getElementById('live-counter');
  lc.style.transform='scale(1.3)';lc.style.color='var(--em2)';
  setTimeout(()=>{lc.style.transform='';lc.style.color='';},400);
}

// ═══════════════════════════════════════════════════════════
// LANGUAGES
// ═══════════════════════════════════════════════════════════
function buildLanguages(){
  const grid=document.getElementById('lang-grid');
  if(!grid)return;
  grid.innerHTML=LANGUAGES.map((l,i)=>`<button class="lang-btn${i===0?' active':''}" onclick="selectLang(this,'${l}')" role="listitem">${l}</button>`).join('');
}
function selectLang(btn,lang){
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  toast(`Charter translation in ${lang} — loading community version`,'info');
}

// ═══════════════════════════════════════════════════════════
// SOCIAL SHARING (Feature 42 — Rich OG sharing)
// ═══════════════════════════════════════════════════════════
const SHARE_URL='https://sherpacarta.org/';
const SHARE_TEXT='I signed SherpaCarta — the Global Digital Magna Carta. 114 articles protecting privacy, data sovereignty, and freedom for all 8B people on Earth. Privacy is a human right. #SherpaCarta #DigitalRights #PrivacyFirst';

function shareOn(platform){
  const encodedURL=encodeURIComponent(SHARE_URL);
  const encodedText=encodeURIComponent(SHARE_TEXT);
  const urls={
    x:`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedURL}`,
    facebook:`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    whatsapp:`https://wa.me/?text=${encodedText}%20${encodedURL}`,
    telegram:`https://t.me/share/url?url=${encodedURL}&text=${encodedText}`,
    linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
  };
  if(urls[platform])window.open(urls[platform],'_blank','width=600,height=500,noopener,noreferrer');
  else{navigator.clipboard.writeText(SHARE_URL);toast('URL copied!','success');}
}

function copyPageURL(){
  navigator.clipboard.writeText(SHARE_URL).then(()=>toast('Link copied to clipboard!','success'));
}

function shareCharter(){
  if(navigator.share)navigator.share({title:'SherpaCarta — Global Digital Magna Carta',text:SHARE_TEXT,url:SHARE_URL});
  else{shareOn('x');}
}

// ═══════════════════════════════════════════════════════════
// CHARTER MODAL
// ═══════════════════════════════════════════════════════════
function openCharterModal(){
  document.getElementById('charter-modal').classList.add('open');
  document.body.style.overflow='hidden';
  buildFullCharter();
}
function closeCharterModal(){
  document.getElementById('charter-modal').classList.remove('open');
  document.body.style.overflow='';
  if(state.readingAloud){window.speechSynthesis.cancel();state.readingAloud=false;updateVoiceBtn();}
}
document.getElementById('charter-modal').addEventListener('click',e=>{if(e.target===document.getElementById('charter-modal'))closeCharterModal();});

function buildFullCharter(){
  const container=document.getElementById('charter-content');
  if(container.children.length>0)return;
  container.innerHTML=CHARTER.map(ch=>`
    <div class="charter-section">
      <div class="charter-chapter">${ch.chapter}</div>
      ${ch.articles.map(art=>`
        <div class="charter-article">
          <div class="ca-num">${art.num}${art.sherpa?' · SHERPACARTA EXTENSION':''}</div>
          <div class="ca-title">${art.title}</div>
          <div class="ca-body">${art.body.replace(/\n\n/g,'<br><br>')}</div>
          ${art.sherpa_ext?`<div class="ca-sherpa"><strong>SHERPACARTA EXTENSION</strong>${art.sherpa_ext}</div>`:''}
          <div style="margin-top:.75rem;display:flex;gap:.35rem;flex-wrap:wrap">${art.tags.map(t=>`<span class="art-tag">#${t}</span>`).join('')}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function makeAllEditable(){
  document.querySelectorAll('.ca-body,.ca-title').forEach(el=>{
    el.contentEditable='true';el.style.outline='1px dashed var(--em)';el.style.borderRadius='3px';el.style.padding='2px 4px';
  });
  toast('Charter is now editable. Save draft locally or stamp on Bitcoin when ready.','info');
}

function saveCharterDraft(){
  const draft={saved:Date.now(),articles:[]};
  document.querySelectorAll('.charter-article').forEach(el=>{
    draft.articles.push({title:el.querySelector('.ca-title')?.textContent||'',body:el.querySelector('.ca-body')?.innerHTML||''});
  });
  if(!draft.articles.length){toast('Open the full charter first','error');return;}
  localStorage.setItem('sc_charter_draft',JSON.stringify(draft));
  toast('Draft saved locally. Rights may only expand (Art. 114).','success');
}

function getCharterPlainText(){
  return CHARTER.flatMap(ch=>ch.articles.map(a=>`${a.num}: ${a.title}\n${a.body.replace(/<[^>]+>/g,'')}\n${a.sherpa_ext||''}`)).join('\n\n');
}

async function stampCharterOnBitcoin(){
  try{
    const text=getCharterPlainText();
    const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    const hash=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    state.charterHash=hash;
    localStorage.setItem('sc_charter_hash',hash);
    toast('Charter hashed. Opening Satohash to stamp on Bitcoin…','info');
    window.open(`${SATOHASH_URL}?ref=sherpacarta&hash=${hash}`,'_blank','noopener');
  }catch(e){toast('Could not compute charter hash','error');}
}

function initWalletAddresses(){
  const els={
    btc:['btc-address','footer-btc-address'],
    ln:['donate-ln-address','footer-ln-address']
  };
  els.btc.forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=SHERPA_WALLETS.btc;});
  els.ln.forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=SHERPA_WALLETS.lnTemp;});
}

function switchDonateTab(tab){
  const isBtc=tab==='btc';
  document.getElementById('donate-tab-btc').classList.toggle('active',isBtc);
  document.getElementById('donate-tab-ln').classList.toggle('active',!isBtc);
  document.getElementById('donate-pane-btc').hidden=!isBtc;
  document.getElementById('donate-pane-ln').hidden=isBtc;
}

function showQRModal(type){
  qrCurrentType=type;
  qrCurrentAddress=type==='btc'?SHERPA_WALLETS.btc:SHERPA_WALLETS.lnTemp;
  const modal=document.getElementById('qr-modal');
  const title=document.getElementById('qr-modal-title');
  const sub=document.getElementById('qr-modal-sub');
  const warn=document.getElementById('qr-warning');
  const display=document.getElementById('qr-address-display');
  title.textContent=type==='btc'?'Bitcoin Donation':'Lightning (TEMP)';
  sub.textContent=type==='btc'?'ON-CHAIN · SCAN TO DONATE':'TEST PLACEHOLDER ONLY';
  warn.style.display=type==='ln'?'block':'none';
  warn.innerHTML=type==='ln'?'<i class="fas fa-triangle-exclamation"></i> <strong>TEMP ADDRESS — DO NOT SEND.</strong> Lightning is not live yet.':'';
  display.textContent=qrCurrentAddress;
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  if(typeof window.renderQRCode==='function') window.renderQRCode(qrCurrentAddress);
}

function closeQRModal(){
  const modal=document.getElementById('qr-modal');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow='';
}

function copyQRAddress(){
  navigator.clipboard.writeText(qrCurrentAddress).then(()=>toast('Address copied!','success'));
}

function copyNostrNip(){
  navigator.clipboard.writeText(NOSTR_NIP05).then(()=>toast('Nostr NIP-05 copied: ' + NOSTR_NIP05,'success'));
}

function contactEmail(){
  location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(CONTACT_SUBJECT);
}

function focusA11yToolbar(){
  const bar=document.getElementById('a11y-toolbar');
  if(bar){
    bar.classList.add('visible');
    bar.style.display='flex';
    const btn=bar.querySelector('button');
    if(btn) btn.focus();
    toast('Accessibility toolbar — adjust font, contrast, and reading mode','info');
  }else{
    toast('Reload the page to enable the accessibility toolbar','info');
  }
}

// ═══ NOSTR ════════════════════════════════════════════════
function updateNostrUI(){
  const badge=document.getElementById('nostr-badge');
  const connect=document.getElementById('nostr-connect-btn');
  const disconnect=document.getElementById('nostr-disconnect-btn');
  if(state.nostrPubkey){
    badge.className='nostr-badge connected';
    badge.innerHTML=`<i class="fas fa-check"></i> Nostr: ${state.nostrPubkey.slice(0,8)}…${state.nostrPubkey.slice(-4)}`;
    if(connect)connect.style.display='none';
    if(disconnect)disconnect.style.display='inline-flex';
  }else{
    badge.className='nostr-badge';
    badge.innerHTML='<i class="fas fa-user-secret"></i> Nostr: Not connected';
    if(connect)connect.style.display='inline-flex';
    if(disconnect)disconnect.style.display='none';
  }
}

async function nostrConnect(){
  if(!window.nostr){toast('Install a Nostr browser extension (Alby, nos2x, or Primal)','error');return;}
  try{
    const pk=await window.nostr.getPublicKey();
    state.nostrPubkey=pk;
    localStorage.setItem('sc_nostr_pk',pk);
    updateNostrUI();
    toast('Connected via Nostr — your keys never touch our servers','success');
  }catch(e){toast('Nostr connection declined','error');}
}

function nostrDisconnect(){
  state.nostrPubkey=null;
  localStorage.removeItem('sc_nostr_pk');
  updateNostrUI();
  toast('Nostr disconnected','info');
}

async function publishToNostr(content,tags=[]){
  if(!window.nostr||!state.nostrPubkey)return false;
  const event={kind:1,created_at:Math.floor(Date.now()/1000),tags:[['t','sherpacarta'],...tags],content,pubkey:state.nostrPubkey};
  try{
    const signed=await window.nostr.signEvent(event);
    for(const relay of NOSTR_RELAYS){
      try{
        const ws=new WebSocket(relay);
        ws.onopen=()=>{ws.send(JSON.stringify(['EVENT',signed]));setTimeout(()=>ws.close(),800);};
      }catch(_){}
    }
    return true;
  }catch(e){return false;}
}

function renderAmendments(){
  const list=document.getElementById('amend-list');
  if(!list)return;
  const items=[...state.amendments].reverse().slice(0,12);
  list.innerHTML=items.length?items.map(a=>`
    <div class="amend-item">
      <strong>${a.article||'General'}</strong> — ${a.text}
      <div class="amend-meta">${a.author||'Anonymous'} · ${new Date(a.ts).toLocaleDateString()}${a.nostr?' · Nostr':''}</div>
    </div>
  `).join(''):'<div class="amend-item" style="color:var(--text3)">No proposals yet. Be the first to suggest an expansion of rights.</div>';
}

async function submitAmendment(){
  const article=document.getElementById('amend-article').value.trim();
  const text=document.getElementById('amend-text').value.trim();
  if(!text){toast('Enter your amendment proposal','error');return;}
  const name=document.getElementById('sign-name').value.trim()||'Anonymous';
  const entry={article,text,author:name,ts:Date.now(),nostr:false};
  const nostrMsg=`[SherpaCarta Amendment${article?' '+article:''}]\n${text}\n\n— ${name}\nhttps://sherpacarta.org`;
  if(state.nostrPubkey){
    const ok=await publishToNostr(nostrMsg,[['t','amendment'],...(article?[['article',article]]:[])]);
    if(ok)entry.nostr=true;
  }
  state.amendments.push(entry);
  localStorage.setItem('sc_amendments',JSON.stringify(state.amendments));
  document.getElementById('amend-text').value='';
  document.getElementById('amend-article').value='';
  renderAmendments();
  toast(entry.nostr?'Amendment saved and published to Nostr':'Amendment saved locally. Connect Nostr to publish publicly.','success');
}

function printCharter(){window.print();}

// ═══ DOWNLOAD CHARTER (Feature 43) ════════════════════════
function downloadCharter(){
  const content=CHARTER.flatMap(ch=>[`\n\n=== ${ch.chapter.toUpperCase()} ===\n`,...ch.articles.map(a=>`\n${a.num}: ${a.title}\n${a.body.replace(/<[^>]+>/g,'').replace(/\n\n/g,'\n')}\n${a.sherpa_ext?'\nSHERPACARTA EXTENSION: '+a.sherpa_ext:''}\nTags: ${a.tags.join(', ')}\n`)]).join('\n');
  const blob=new Blob([`SHERPACARTA v2.0 — THE GLOBAL DIGITAL MAGNA CARTA\nPublished under CC0 1.0 Universal (Public Domain)\nhttps://sherpacarta.org\n${content}\n\n--- END OF CHARTER ---`],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='SherpaCarta-v2.0.txt';a.click();
  toast('Charter downloaded as .txt','success');
}

let searchVisible=false;
function searchCharter(){
  searchVisible=!searchVisible;
  document.getElementById('charter-search-box').style.display=searchVisible?'block':'none';
  if(searchVisible)document.getElementById('charter-search-input').focus();
}
function filterCharter(q){
  document.querySelectorAll('.charter-article').forEach(el=>{el.style.display=(el.textContent.toLowerCase().includes(q.toLowerCase())||!q)?'block':'none';});
}

// ═══ VOICE READING ════════════════════════════════════════
function readAloud(){
  if(!('speechSynthesis' in window)){toast('Speech synthesis not supported','error');return;}
  if(state.readingAloud){window.speechSynthesis.cancel();state.readingAloud=false;updateVoiceBtn();return;}
  const text=CHARTER.flatMap(ch=>ch.articles.map(a=>a.title+'. '+a.body.replace(/<[^>]+>/g,''))).join('. ');
  state.utterance=new SpeechSynthesisUtterance(text);
  state.utterance.rate=.9;
  state.utterance.onend=()=>{state.readingAloud=false;updateVoiceBtn();};
  window.speechSynthesis.speak(state.utterance);
  state.readingAloud=true;updateVoiceBtn();
}
function updateVoiceBtn(){
  const btn=document.getElementById('voice-btn');
  if(btn)btn.innerHTML=state.readingAloud?'<i class="fas fa-stop"></i> Stop':'<i class="fas fa-volume-high"></i> Read Aloud';
}

// ═══════════════════════════════════════════════════════════
// FAQ ACCORDION (Feature 44)
// ═══════════════════════════════════════════════════════════
function toggleFaq(q){
  const item=q.parentElement;
  const answer=item.querySelector('.faq-a');
  const isOpen=item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('active');i.querySelector('.faq-a').classList.remove('open');});
  if(!isOpen){item.classList.add('active');answer.classList.add('open');}
}

// ═══════════════════════════════════════════════════════════
// NEWSLETTER (Feature 45)
// ═══════════════════════════════════════════════════════════
function subscribeNewsletter(){
  const email=document.getElementById('newsletter-email').value.trim();
  if(!email||!email.includes('@')){toast('Please enter a valid email address','error');return;}
  if(localStorage.getItem('sc_newsletter')){toast('You\'re already subscribed!','info');return;}
  localStorage.setItem('sc_newsletter',email);
  document.getElementById('newsletter-email').value='';
  toast(`Subscribed! Rights Dispatch will arrive at ${email} (simulated — no server).`,'success');
}

// ═══════════════════════════════════════════════════════════
// COMMAND PALETTE
// ═══════════════════════════════════════════════════════════
const CMD_ITEMS=[
  {group:'Navigate',icon:'fa-scroll',label:'Open Full Charter',sub:'All 114 articles',action:openCharterModal},
  {group:'Navigate',icon:'fa-signature',label:'Sign the Charter',sub:'Add your name',action:()=>document.getElementById('sign').scrollIntoView({behavior:'smooth'})},
  {group:'Navigate',icon:'fa-calculator',label:'Rights Calculator',sub:'Check your protection score',action:()=>document.querySelector('.calc-grid').scrollIntoView({behavior:'smooth'})},
  {group:'Navigate',icon:'fa-clock-rotate-left',label:'Timeline',sub:'1215 → 2026',action:()=>document.querySelector('.timeline').scrollIntoView({behavior:'smooth'})},
  {group:'Contact',icon:'fa-envelope',label:'Email Give A Bit',sub:'hello@giveabit.io',action:contactEmail},
  {group:'Contact',icon:'fa-user-secret',label:'Copy Nostr NIP-05',sub:'kimi@giveabit.io',action:copyNostrNip},
  {group:'Share',icon:'fa-x-twitter fab',label:'Share on X / Twitter',sub:'Tweet SherpaCarta',action:()=>shareOn('x')},
  {group:'Share',icon:'fa-whatsapp fab',label:'Share on WhatsApp',sub:'Send to contacts',action:()=>shareOn('whatsapp')},
  {group:'Share',icon:'fa-telegram fab',label:'Share on Telegram',sub:'Send to channels',action:()=>shareOn('telegram')},
  {group:'Share',icon:'fa-linkedin fab',label:'Share on LinkedIn',sub:'Professional network',action:()=>shareOn('linkedin')},
  {group:'Share',icon:'fa-link',label:'Copy Page Link',sub:'Copy URL to clipboard',action:copyPageURL},
  {group:'Actions',icon:'fa-circle-half-stroke',label:'Toggle Theme',sub:'Dark / Light mode',action:toggleTheme},
  {group:'Actions',icon:'fa-print',label:'Print Charter',sub:'Print-optimized view',action:()=>{openCharterModal();setTimeout(printCharter,500);}},
  {group:'Actions',icon:'fa-download',label:'Download Charter',sub:'Save as .txt',action:()=>{openCharterModal();setTimeout(downloadCharter,500);}},
  {group:'Actions',icon:'fa-volume-high',label:'Read Charter Aloud',sub:'Text-to-speech',action:()=>{openCharterModal();setTimeout(readAloud,500);}},
  {group:'Articles',icon:'fa-lock',label:'Art. 11 — Privacy',sub:'The cornerstone article',action:()=>{document.querySelectorAll('.article-tab')[4]?.click();closeCommandPalette();}},
  {group:'Articles',icon:'fa-database',label:'Art. 12 — Data Sovereignty',sub:'You own your data',action:()=>{document.querySelectorAll('.article-tab')[5]?.click();closeCommandPalette();}},
  {group:'Articles',icon:'fa-ban',label:'Art. 13 — Surveillance Capitalism',sub:'Your behavior cannot be sold',action:()=>{document.querySelectorAll('.article-tab')[6]?.click();closeCommandPalette();}},
  {group:'Articles',icon:'fa-brain',label:'Art. 61 — Algorithmic Rights',sub:'Right to explanation',action:()=>{document.querySelectorAll('.article-tab')[10]?.click();closeCommandPalette();}},
  {group:'Bitcoin',icon:'fa-bitcoin fab',label:'Copy Bitcoin Address',sub:'Support the mission',action:copyBTC},
];
window.CMD_ITEMS = CMD_ITEMS;

let cmdFocused=0;
function openCommandPalette(){document.getElementById('cmd-overlay').classList.add('open');document.getElementById('cmd-input').focus();cmdSearch('');}
function closeCommandPalette(){document.getElementById('cmd-overlay').classList.remove('open');document.getElementById('cmd-input').value='';}
function cmdSearch(q){
  const query=q.toLowerCase();
  const filtered=CMD_ITEMS.filter(i=>!q||i.label.toLowerCase().includes(query)||i.sub.toLowerCase().includes(query)||i.group.toLowerCase().includes(query));
  const groups=[...new Set(filtered.map(i=>i.group))];
  const container=document.getElementById('cmd-results');cmdFocused=0;
  container.innerHTML=groups.map(g=>`
    <div class="cmd-group-label">${g}</div>
    ${filtered.filter(i=>i.group===g).map(item=>`
      <div class="cmd-item" onclick="(${item.action.toString()})();closeCommandPalette()" role="option">
        <div class="cmd-item-icon"><i class="fas ${item.icon}"></i></div>
        <div><div class="cmd-item-text">${item.label}</div><div class="cmd-item-sub">${item.sub}</div></div>
      </div>`).join('')}
  `).join('');
}
function cmdKey(e){
  if(e.key==='Escape')closeCommandPalette();
  if(e.key==='Enter'){const items=document.querySelectorAll('.cmd-item');if(items[cmdFocused])items[cmdFocused].click();}
  if(e.key==='ArrowDown'){const items=document.querySelectorAll('.cmd-item');items[cmdFocused]?.classList.remove('focused');cmdFocused=(cmdFocused+1)%items.length;items[cmdFocused]?.classList.add('focused');items[cmdFocused]?.scrollIntoView({block:'nearest'});}
  if(e.key==='ArrowUp'){const items=document.querySelectorAll('.cmd-item');items[cmdFocused]?.classList.remove('focused');cmdFocused=(cmdFocused-1+items.length)%items.length;items[cmdFocused]?.classList.add('focused');items[cmdFocused]?.scrollIntoView({block:'nearest'});}
}

// ═══════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openCommandPalette();}
  if(e.key==='Escape'){closeQRModal();closeCharterModal();closeCommandPalette();if(window.SC?.closeShortcuts)SC.closeShortcuts();}
  if((e.metaKey||e.ctrlKey)&&e.key==='p'){e.preventDefault();openCharterModal();setTimeout(printCharter,500);}
  if((e.metaKey||e.ctrlKey)&&e.key==='d'){e.preventDefault();openCharterModal();setTimeout(downloadCharter,500);}
  if(e.key==='?'&&!e.target.matches('input,textarea')){openCommandPalette();}
});

// ═══════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('sc_theme',next);
  toast(`Switched to ${next} mode`,'info');
}

// ═══════════════════════════════════════════════════════════
// COPY BTC
// ═══════════════════════════════════════════════════════════
function copyBTC(){
  copyPayAddress('btc', document.getElementById('btc-address'), document.getElementById('copy-btn'), '<i class="fab fa-bitcoin"></i> COPY ADDRESS');
}

function switchPayTab(tab){
  const btcTab=document.getElementById('pay-tab-btc');
  const lnTab=document.getElementById('pay-tab-ln');
  const btcPane=document.getElementById('pay-pane-btc');
  const lnPane=document.getElementById('pay-pane-ln');
  const isBtc=tab==='btc';
  btcTab.classList.toggle('active',isBtc);
  lnTab.classList.toggle('active',!isBtc);
  btcTab.setAttribute('aria-selected',isBtc);
  lnTab.setAttribute('aria-selected',!isBtc);
  btcPane.classList.toggle('active',isBtc);
  lnPane.classList.toggle('active',!isBtc);
  btcPane.hidden=!isBtc;
  lnPane.hidden=isBtc;
}

function copyPayAddress(kind, addrEl, btnEl, resetHtml){
  const map={
    btc:{el:addrEl||document.getElementById('footer-btc-address'),btn:btnEl||document.getElementById('footer-copy-btc'),reset:resetHtml||'<i class="fab fa-bitcoin"></i> Copy Bitcoin Address',msg:'Bitcoin address copied!'},
    ln:{el:document.getElementById('footer-ln-address')||document.getElementById('donate-ln-address'),btn:btnEl||document.getElementById('footer-copy-ln'),reset:resetHtml||'<i class="fas fa-bolt"></i> Copy Lightning',msg:'Lightning address copied (TEMP — do not send)'}
  };
  const cfg=map[kind];
  if(!cfg||!cfg.el||!cfg.btn)return;
  const addr=cfg.el.textContent.trim();
  navigator.clipboard.writeText(addr).then(()=>{
    cfg.btn.classList.add('copied');
    cfg.btn.innerHTML='<i class="fas fa-check"></i> Copied!';
    toast(cfg.msg,'success');
    setTimeout(()=>{cfg.btn.classList.remove('copied');cfg.btn.innerHTML=cfg.reset;},2500);
  });
}

(function initMobileNav(){
  const toggle=document.getElementById('nav-toggle');
  const actions=document.getElementById('nav-menu');
  if(!toggle||!actions)return;
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',open?'false':'true');
    actions.classList.toggle('open',!open);
    toggle.innerHTML=open?'<i class="fas fa-bars" aria-hidden="true"></i>':'<i class="fas fa-xmark" aria-hidden="true"></i>';
  });
  actions.querySelectorAll('button,select').forEach(el=>{
    el.addEventListener('click',()=>{
      toggle.setAttribute('aria-expanded','false');
      actions.classList.remove('open');
      toggle.innerHTML='<i class="fas fa-bars" aria-hidden="true"></i>';
    });
  });
  document.addEventListener('click',e=>{
    if(!toggle.contains(e.target)&&!actions.contains(e.target)){
      toggle.setAttribute('aria-expanded','false');
      actions.classList.remove('open');
      toggle.innerHTML='<i class="fas fa-bars" aria-hidden="true"></i>';
    }
  });
})();

// ═══════════════════════════════════════════════════════════
// ASSERT RIGHTS
// ═══════════════════════════════════════════════════════════
function assertRights(){
  const assertions=[
    'I assert my right to privacy under SherpaCarta Article 11.',
    'My data belongs to me. Article 12 is my shield.',
    'No algorithm may judge me without explanation. Article 61.',
    'I am a signatory. My rights are inviolable.',
    'Surveillance capitalism violates my dignity. Article 13.',
    'Internet access is my right, not a privilege. Article 22.',
    'I have the right to be forgotten. Article 47.',
    'Digital dignity is human dignity. Article 1.',
  ];
  toast(assertions[Math.floor(Math.random()*assertions.length)],'success');
}

// ═══════════════════════════════════════════════════════════
// AMBIENT MODE (Feature 46)
// ═══════════════════════════════════════════════════════════
let ambientCtx, ambientAnimId;
function toggleAmbient(){
  state.ambientOn=!state.ambientOn;
  const indicator=document.getElementById('audio-indicator');
  const bars=indicator.querySelector('.audio-bars');
  const label=document.getElementById('audio-label');
  if(state.ambientOn){
    bars.classList.remove('paused');
    label.textContent='Playing';
    indicator.setAttribute('aria-pressed','true');
    // Create subtle pulsing background glow
    const glow=document.querySelector('.hero-glow');
    if(glow){
      let tick=0;
      ambientAnimId=setInterval(()=>{
        tick++;
        const scale=1+Math.sin(tick*.05)*.3;
        const opacity=.08+Math.sin(tick*.05)*.04;
        glow.style.transform=`translate(-50%,-50%) scale(${scale})`;
        glow.style.background=`radial-gradient(circle,rgba(16,185,129,${opacity}) 0%,transparent 70%)`;
      },50);
    }
    toast('Ambient mode on — visual pulse active','info');
  } else {
    bars.classList.add('paused');label.textContent='Ambient';
    indicator.setAttribute('aria-pressed','false');
    clearInterval(ambientAnimId);
    const glow=document.querySelector('.hero-glow');
    if(glow){glow.style.transform='translate(-50%,-50%) scale(1)';glow.style.background='radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)';}
    toast('Ambient mode off','info');
  }
}

// ═══════════════════════════════════════════════════════════
// COOKIE BANNER (Feature 47)
// ═══════════════════════════════════════════════════════════
function acceptCookies(){
  localStorage.setItem('sc_cookie_accepted','true');
  document.getElementById('cookie-banner').style.display='none';
  toast('Noted. (We still collect nothing.)','success');
}

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════
function toast(msg,type='info'){
  const icons={success:'fa-check-circle',error:'fa-circle-exclamation',info:'fa-circle-info'};
  const el=document.createElement('div');
  el.className='toast'+(type==='error'?' error':'');
  el.innerHTML=`<i class="fas ${icons[type]||'fa-circle-info'}"></i> ${msg}`;
  document.getElementById('toast-stack').appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(20px)';el.style.transition='all .3s';setTimeout(()=>el.remove(),300);},4500);
}

// ═══════════════════════════════════════════════════════════
// DOMContentLoaded INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  initWalletAddresses();
  updateNostrUI();
  renderAmendments();
  buildArticlesBrowser();
  buildSigners();
  buildLanguages();
  initQuotes();

  // Show cookie banner if not accepted
  if(!localStorage.getItem('sc_cookie_accepted')){
    setTimeout(()=>{document.getElementById('cookie-banner').style.display='flex';},2000);
  }

  // Welcome toast
  setTimeout(()=>toast('Welcome to SherpaCarta. Privacy is your birthright.','info'),1200);

  // Signer stat animates on view
  const ss=document.getElementById('signer-stat');
  if(ss&&ss.dataset.count){
    const so=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateCount(e.target);so.unobserve(e.target);}});},{threshold:.5});
    so.observe(ss);
  }

  // Apply saved lang
  if(state.lang!=='en'){
    const sel=document.getElementById('nav-lang');
    if(sel)sel.value=state.lang;
    applyTranslation(state.lang);
  }
});

// Service Worker registration for offline (Feature 48)
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    // In production: navigator.serviceWorker.register('/sw.js')
    // Simulated offline indicator
    window.addEventListener('offline',()=>toast('You are offline. SherpaCarta still works locally.','info'));
    window.addEventListener('online',()=>toast('Back online.','success'));
  });
}

// Feature 49: Detect first visit, show brief onboarding hint
if(!localStorage.getItem('sc_visited')){
  localStorage.setItem('sc_visited','true');
  setTimeout(()=>toast('Tip: Press ⌘K to search all articles and commands','info'),3500);
}

// Feature 50: Simulated auto-increment removed BUILD 507 — real local signatures only
localStorage.setItem('sc_real_counts_only','1');

// Feature 51: Right-click context menu suppressor with custom menu
document.addEventListener('contextmenu',e=>{
  if(e.target.matches('.charter-article,.ca-body,.art-body')){
    e.preventDefault();
    toast('Tip: This text is public domain (CC0). Copy freely!','info');
  }
});

// Feature 52: Page visibility — pause quote timer when hidden
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)clearInterval(quoteTimer);
  else resetQuoteTimer();
});
