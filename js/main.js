/* ============================================
   LANGUAGE SWITCHER + I18N ATTRIBUTI
   ============================================ */
function currentLang() {
  return document.documentElement.getAttribute("data-lang") || "it";
}

function applyTranslations() {
  const lang = currentLang();

  const titleEl = document.querySelector("title[data-i18n-title-it]");
  if (titleEl) {
    const val = titleEl.getAttribute(`data-i18n-title-${lang}`);
    if (val) {
      document.title = val;
      titleEl.textContent = val;
    }
  }

  document.querySelectorAll("meta[data-i18n-content-it]").forEach((el) => {
    const val = el.getAttribute(`data-i18n-content-${lang}`);
    if (val) el.setAttribute("content", val);
  });

  document.querySelectorAll("[data-i18n-placeholder-it]").forEach((el) => {
    const val = el.getAttribute(`data-i18n-placeholder-${lang}`);
    if (val) el.setAttribute("placeholder", val);
  });

  document.querySelectorAll("[data-i18n-aria-it]").forEach((el) => {
    const val = el.getAttribute(`data-i18n-aria-${lang}`);
    if (val) el.setAttribute("aria-label", val);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("langToggle");
  const htmlEl = document.documentElement;
  const saved = localStorage.getItem("selectedLanguage") || "it";

  htmlEl.setAttribute("data-lang", saved);
  htmlEl.lang = saved;
  applyTranslations();

  if (!langToggle) return;

  langToggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-lang") || "it";
    const next = current === "it" ? "en" : "it";

    htmlEl.setAttribute("data-lang", next);
    htmlEl.lang = next;
    localStorage.setItem("selectedLanguage", next);

    applyTranslations();
  });
});

/* ============================================
   TAB BAR
   ============================================ */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    const grid = document.querySelector(".grid");
    if (!grid) return;
    const type = this.dataset.tab;
    grid.dataset.active = type;

    const tiles = grid.querySelectorAll(".tile");
    tiles.forEach((tile, i) => {
      if (type === "grid") {
        tile.style.display = "";
      } else if (type === "reels") {
        tile.style.display = i === 2 || i === 3 ? "" : "none";
      } else if (type === "tags") {
        tile.style.display = i === 0 || i === 1 ? "" : "none";
      }
    });
  });
});

/* ============================================
   CHAT FINTA
   ============================================ */
const chatWindow = document.getElementById("chatWindow");
const chatClose = document.getElementById("chatClose");
const chatBody = document.getElementById("chatBody");
const chatTyping = document.getElementById("chatTyping");
const chatInputRow = document.getElementById("chatInputRow");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

const chatOpeners = [document.getElementById("openChatBtn")].filter(Boolean);

let chatStarted = false;

const chatScript = [
  { from: "left", key: "Ciao! 👋" },
  {
    from: "left",
    it: "Hai bisogno di un preventivo o di altre informazioni?",
    en: "Do you need a quote or more information?",
  },
  {
    from: "left",
    it: 'Digita "CONTATTI" per ricevere tutti i miei recapiti 👇',
    en: 'Type "CONTACTS" to get all my contact details 👇',
  },
];

function addMessage(msg) {
  const div = document.createElement("div");
  div.className = `chat-msg ${msg.from}`;
  div.textContent = msg.key
    ? msg.key
    : currentLang() === "it"
      ? msg.it
      : msg.en;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping(show) {
  chatTyping.style.display = show ? "flex" : "none";
}

function runChatScript() {
  if (chatStarted) return;
  chatStarted = true;
  let i = 0;
  const step = () => {
    if (i >= chatScript.length) {
      chatInputRow.style.display = "flex";
      chatInput && chatInput.focus();
      return;
    }
    showTyping(true);
    setTimeout(() => {
      showTyping(false);
      addMessage(chatScript[i]);
      i++;
      setTimeout(step, 500);
    }, 900);
  };
  step();
}

function openChat() {
  chatWindow.classList.add("open");
  chatWindow.setAttribute("aria-hidden", "false");
  runChatScript();
}

function closeChat() {
  chatWindow.classList.remove("open");
  chatWindow.setAttribute("aria-hidden", "true");
}

chatOpeners.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    chatWindow.classList.contains("open") ? closeChat() : openChat();
  });
});

if (chatClose) chatClose.addEventListener("click", closeChat);

document.addEventListener("click", (e) => {
  if (!chatWindow.classList.contains("open")) return;
  if (chatWindow.contains(e.target)) return;
  if (chatOpeners.some((btn) => btn.contains(e.target))) return;
  closeChat();
});

/* ============================================
   CHAT INPUT — invio messaggio + contatti inline
   ============================================ */
function buildContactsMarkup() {
  const lang = currentLang();
  const title =
    lang === "it" ? "Ecco come puoi contattarmi:" : "Here's how to reach me:";

  const wrapper = document.createElement("div");
  wrapper.className = "chat-msg left chat-msg-contacts";

  const titleEl = document.createElement("p");
  titleEl.className = "chat-contacts-title";
  titleEl.textContent = title;
  wrapper.appendChild(titleEl);

  const list = document.createElement("div");
  list.className = "chat-contacts-list";

  const links = [
    {
      href: "https://linkedin.com/in/marikaguardi",
      icon: "img/icons/linkedin.svg",
      label: "LinkedIn",
    },
    {
      href: "https://wa.me/393770948721",
      icon: "img/icons/whatsapp.svg",
      label: "WhatsApp",
    },
    {
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=ciao@aurwebdev.com",
      icon: "img/icons/email.svg",
      label: "Email",
    },
  ];

  links.forEach(({ href, icon, label }) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "chat-contact-link";

    const img = document.createElement("img");
    img.src = icon;
    img.alt = label;
    img.width = 18;
    img.height = 18;

    a.appendChild(img);
    a.appendChild(document.createTextNode(" " + label));
    list.appendChild(a);
  });

  wrapper.appendChild(list);
  return wrapper;
}

function sendChatMessage() {
  if (!chatInput) return;
  const text = chatInput.value.trim();

  if (text) {
    const userMsg = document.createElement("div");
    userMsg.className = "chat-msg right";
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    chatInput.value = "";
  }

  const normalized = text.toLowerCase().trim();
  const isContacts =
    normalized === "contatti" ||
    normalized === "contacts" ||
    normalized.includes("contatt") ||
    normalized.includes("contact");

  showTyping(true);
  setTimeout(() => {
    showTyping(false);

    if (isContacts) {
      chatBody.appendChild(buildContactsMarkup());
    } else {
      const fallback = document.createElement("div");
      fallback.className = "chat-msg left";
      fallback.textContent =
        currentLang() === "it"
          ? 'Scrivi "CONTATTI" per ricevere tutti i miei recapiti 👇'
          : 'Type "CONTACTS" to get all my contact details 👇';
      chatBody.appendChild(fallback);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }, 900);
}

if (chatSend) chatSend.addEventListener("click", sendChatMessage);

if (chatInput) {
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

/* ============================================
   PLAYER AUDIO (profilo)
   ============================================ */
const audioToggle = document.getElementById("audioToggle");
const bgAudio = document.getElementById("bgAudio");
const audioIcon = document.getElementById("audioIcon");

const ICON_PLAY =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

if (audioToggle && bgAudio && audioIcon) {
  audioToggle.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio
        .play()
        .then(() => {
          audioIcon.innerHTML = ICON_PAUSE;
          audioToggle.classList.add("playing");
          audioToggle.setAttribute(
            "aria-label",
            currentLang() === "it" ? "Metti in pausa" : "Pause audio",
          );
        })
        .catch((err) => {
          console.warn("Audio non riproducibile:", err);
        });
    } else {
      bgAudio.pause();
      audioIcon.innerHTML = ICON_PLAY;
      audioToggle.classList.remove("playing");
      audioToggle.setAttribute(
        "aria-label",
        currentLang() === "it" ? "Riproduci audio" : "Play audio",
      );
    }
  });

  bgAudio.addEventListener("ended", () => {
    audioIcon.innerHTML = ICON_PLAY;
    audioToggle.classList.remove("playing");
  });
}

/* ============================================
   PLAYER AUDIO — pausa al click fuori dal player
   ============================================ */
document.addEventListener("click", (e) => {
  if (!bgAudio || bgAudio.paused) return;
  if (!audioToggle) return;

  // se il click è dentro il pulsante audio (o suoi discendenti), ignora
  if (audioToggle.contains(e.target)) return;

  // altrimenti metti in pausa e ripristina l'icona play
  bgAudio.pause();
  if (audioIcon) audioIcon.innerHTML = ICON_PLAY;
  audioToggle.classList.remove("playing");
  audioToggle.setAttribute(
    "aria-label",
    currentLang() === "it" ? "Riproduci audio" : "Play audio",
  );
});

/* ============================================
   STORY VIEWER (testuale, stile IG)
   ============================================ */
const storyOverlay = document.getElementById("storyOverlay");
const storyClose = document.getElementById("storyClose");
const storyProgressBar = document.getElementById("storyProgressBar");
const openStoryBtn = document.getElementById("openStoryBtn");
const storyLike = document.getElementById("storyLike");
const storyReply = document.getElementById("storyReply");
const storySend = document.getElementById("storySend");
const storyToast = document.getElementById("storyToast");
const storyAudio = document.getElementById("storyAudio");

const STORY_DURATION = 15; // secondi

let storyInterval = null;
let storyStartTime = 0;
let storyToastTimer = null;
let storyPaused = false;
let storyPauseTime = 0;

function startStoryProgress() {
  storyStartTime = Date.now();
  storyProgressBar.style.width = "0%";

  clearInterval(storyInterval);
  storyInterval = setInterval(() => {
    if (storyPaused) return;
    const elapsed = (Date.now() - storyStartTime) / 1000;
    const percent = Math.min((elapsed / STORY_DURATION) * 100, 100);
    storyProgressBar.style.width = percent + "%";

    if (percent >= 100) {
      clearInterval(storyInterval);
      closeStory();
    }
  }, 50);
}

function openStory() {
  if (!storyOverlay) return;

  storyOverlay.classList.add("open");
  storyOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Avvia la canzone DELLA STORIA
  if (storyAudio) {
    storyAudio.currentTime = 0;
    storyAudio
      .play()
      .catch((err) => console.warn("Audio storia non riproducibile:", err));
  }

  // Metti in pausa il player del profilo se stava suonando
  if (bgAudio && !bgAudio.paused) {
    bgAudio.pause();
    if (audioIcon) audioIcon.innerHTML = ICON_PLAY;
    if (audioToggle) audioToggle.classList.remove("playing");
  }

  startStoryProgress();
}

function closeStory() {
  if (!storyOverlay) return;

  storyOverlay.classList.remove("open");
  storyOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  clearInterval(storyInterval);
  storyProgressBar.style.width = "0%";

  // Ferma la canzone DELLA STORIA
  if (storyAudio && !storyAudio.paused) {
    storyAudio.pause();
    storyAudio.currentTime = 0;
  }

  if (storyLike) storyLike.classList.remove("liked");
  if (storyReply) storyReply.value = "";
  if (storyToast) {
    storyToast.classList.remove("show");
    storyToast.textContent = "";
  }
  clearTimeout(storyToastTimer);
}

// Pausa tenendo premuto (come IG)
if (storyOverlay) {
  storyOverlay.addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, button")) return;
    storyPaused = true;
    if (storyAudio && !storyAudio.paused) storyAudio.pause();
    storyPauseTime = Date.now();
  });

  storyOverlay.addEventListener("pointerup", () => {
    if (!storyPaused) return;
    storyPaused = false;
    storyStartTime += Date.now() - storyPauseTime;
    if (storyAudio) storyAudio.play().catch(() => {});
  });
}

// Apertura dal click sull'avatar
if (openStoryBtn) {
  openStoryBtn.addEventListener("click", openStory);
  openStoryBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openStory();
    }
  });
}

if (storyClose) storyClose.addEventListener("click", closeStory);

if (storyOverlay) {
  storyOverlay.addEventListener("click", (e) => {
    if (e.target === storyOverlay) closeStory();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && storyOverlay.classList.contains("open")) {
    closeStory();
  }
});

/* ============================================
   STORY — CUORE ROSSO AL CLICK
   ============================================ */
if (storyLike) {
  storyLike.addEventListener("click", (e) => {
    e.stopPropagation();
    storyLike.classList.toggle("liked");

    const isLiked = storyLike.classList.contains("liked");
    const lang = currentLang();
    storyLike.setAttribute(
      "aria-label",
      isLiked
        ? lang === "it"
          ? "Togli mi piace"
          : "Unlike"
        : lang === "it"
          ? "Mi piace"
          : "Like",
    );

    storyLike.classList.remove("pop");
    void storyLike.offsetWidth;
    storyLike.classList.add("pop");
  });
}

/* ============================================
   STORY — INVIO MESSAGGIO
   ============================================ */
function sendStoryMessage() {
  if (!storyReply) return;
  const text = storyReply.value.trim();
  if (!text) return;

  storyReply.value = "";

  if (storyToast) {
    const lang = currentLang();
    storyToast.textContent =
      lang === "it" ? "Messaggio inviato ✓" : "Message sent ✓";
    storyToast.classList.add("show");

    clearTimeout(storyToastTimer);
    storyToastTimer = setTimeout(() => {
      storyToast.classList.remove("show");
    }, 1800);
  }
}

if (storySend) {
  storySend.addEventListener("click", (e) => {
    e.stopPropagation();
    sendStoryMessage();
  });
}

if (storyReply) {
  storyReply.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendStoryMessage();
    }
  });
}

/* ============================================
   POST VIEWER (stile Instagram)
   ============================================ */
const postOverlay = document.getElementById("postOverlay");
const postClose = document.getElementById("postClose");
const postVideo = document.getElementById("postVideo");
const postImage = document.getElementById("postImage");
const postTitle = document.getElementById("postTitle");
const postDesc = document.getElementById("postDesc");
const postLink = document.getElementById("postLink");
const postSubtitle = document.getElementById("postSubtitle");
const postLike = document.getElementById("postLike");

const projectsData = {
  kama: {
    title: "kāma",
    subtitle: { it: "Sito web", en: "Website" },
    video: "video/kama.mp4",
    image: "img/grid/kama.jpg",
    desc: {
      it: "Sono la founder di kāma, un sito web completamente personalizzabile, adatto a qualsiasi tipo di business, gestibile dal cliente tramite dashboard (modifica prezzi, descrizioni, prodotti, immagini, offerte, eventi, link ai social e app di prenotazione). Stack: Laravel + Blade & Bootstrap + Vanilla JS | Database SQLite - Google Translate API.",
      en: "I'm the founder of kama, a fully customizable website, suitable for any kind of business, that can be managed from the client through the dashboard (editing prices, descriptions, products, pictures, offers, events, links to social media and booking apps). Used Stack: Laravel + Blade & Bootstrap + Vanilla JS | Database SQLite - Google Translate API.",
    },
    link: "https://kama-web.com/",
  },
  codex: {
    title: "CodeX Streaming",
    subtitle: { it: "Sito web", en: "Website" },
    video: "video/codex.mp4",
    image: "img/grid/codex.jpeg",
    desc: {
      it: "Simulazione di sito web di streaming online con dashboard admin. Provalo come admin con admin@codex.com o come utente con user@codex.com e password123 per accedere a tutti i contenuti e le funzionalità. Stack: Angular + Laravel + Database MySQL API Restful Bearer Token + JWT Token SHA512.",
      en: "Online streaming website simulation with admin dashboard. Test it as admin with admin@codex.com or as user with user@codex.com and using password123 as password to access all content and features. Used Stack: Angular + Laravel + Database MySQL API Restful Bearer Token + JWT Token SHA512.",
    },
    link: "https://www.aurwebdev.com/",
  },
  swipe: {
    title: "Swipe Cleaner",
    subtitle: { it: "App mobile", en: "Mobile app" },
    video: "video/swipecleaner.mp4",
    image: "img/grid/swipecleaner.jpg",
    desc: {
      it: 'App per pulire la galleria fotografica dello smartphone con uno swipe (sinistra: "Mantieni", destra: "Elimina"). Le immagini contrassegnate per l\'eliminazione vengono aggiunte a una lista che richiede conferma prima della cancellazione definitiva. Stack: React Native - TypeScript - Expo Platform.',
      en: 'An app to clean the smartphone photo gallery with a swipe (left: "Keep it", right: "Delete it"). Pictures marked for deletion are added to a list that requires confirmation before being permanently deleted. Used Stack: React Native - Typescript - Expo Platform.',
    },
    link: "https://tinyurl.com/SwipeCleanerApk",
  },
  coinfarm: {
    title: "Coin Farm",
    subtitle: { it: "Gioco arcade", en: "Arcade game" },
    video: "video/coinfarm.mp4",
    image: "img/grid/coinfarm.jpeg",
    desc: {
      it: "Coin Farm è un gioco arcade interattivo in cui il giocatore deve raccogliere monete evitando gli ostacoli. Stack: HTML, CSS, JavaScript Vanilla.",
      en: "Coin Farm is an interactive arcade game developed, in which the player must collect coins while avoiding obstacles. Used Stack: Html, Css, Javascript Vanilla.",
    },
    link: "https://coinfarmgame.netlify.app",
  },
  oleificio: {
    title: "Oleificio Lombardo",
    subtitle: { it: "Sito web", en: "Website" },
    video: "video/oleificiolombardo.mp4",
    image: "img/grid/oleificiolombardo.jpeg",
    desc: {
      it: "Sito web per un frantoio oleario collegato all'account Shopify, progettato per rispecchiare lo stile del sito. Ho scelto la palette di colori e le forme, ispirate alle olive e alla campagna siciliana, riflettendo la mia attenzione ai dettagli e l'impegno per un'esperienza utente autentica. Stack: HTML, CSS, JavaScript Vanilla.",
      en: "Website for an olive oil mill connected to the Shopify account, designed to match the website's style. I chose the colour palette and shapes, inspired by olives and the Sicilian countryside, reflecting my attention to detail and commitment to an authentic user experience. Used Stack: HTML, CSS, Vanilla JavaScript.",
    },
    link: "https://oleificiolombardo.it",
  },
};

function openPost(key) {
  const data = projectsData[key];
  if (!data) return;

  postTitle.textContent = data.title;
  postSubtitle.textContent =
    currentLang() === "it" ? data.subtitle.it : data.subtitle.en;

  postDesc.textContent = currentLang() === "it" ? data.desc.it : data.desc.en;

  postLink.href = data.link;

  if (data.video) {
    postVideo.style.display = "block";
    postImage.style.display = "none";
    postVideo.src = data.video;
    postVideo.load();
    const p = postVideo.play();
    if (p !== undefined) p.catch(() => {});
  } else if (data.image) {
    postVideo.style.display = "none";
    postImage.style.display = "block";
    postImage.src = data.image;
    postImage.alt = data.title;
  }

  if (postLike) postLike.classList.remove("liked");

  postOverlay.classList.add("open");
  postOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePost() {
  if (!postOverlay) return;
  postOverlay.classList.remove("open");
  postOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (postVideo) {
    postVideo.pause();
    postVideo.removeAttribute("src");
    postVideo.load();
  }
  if (postImage) postImage.removeAttribute("src");
}

document.querySelectorAll(".grid .tile:not(.tile-more)").forEach((tile) => {
  const href = tile.getAttribute("href") || "";
  let key = null;
  if (href.includes("kama-web")) key = "kama";
  else if (href.includes("aurwebdev.com")) key = "codex";
  else if (href.includes("appetize.io")) key = "swipe";
  else if (href.includes("coinfarmgame")) key = "coinfarm";
  else if (href.includes("oleificiolombardo")) key = "oleificio";

  if (!key) return;

  tile.addEventListener("click", (e) => {
    e.preventDefault();
    openPost(key);
  });
});

if (postClose) postClose.addEventListener("click", closePost);
if (postOverlay) {
  postOverlay.addEventListener("click", (e) => {
    if (e.target === postOverlay) closePost();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && postOverlay.classList.contains("open")) {
    closePost();
  }
});

if (postLike) {
  postLike.addEventListener("click", (e) => {
    e.stopPropagation();
    postLike.classList.toggle("liked");
    postLike.classList.remove("pop");
    void postLike.offsetWidth;
    postLike.classList.add("pop");
  });
}

/* ============================================
   HIGHLIGHT VIEWER (stile storia)
   ============================================ */
const highlightOverlay = document.getElementById("highlightOverlay");
const highlightClose = document.getElementById("highlightClose");
const highlightContent = document.getElementById("highlightContent");
const highlightLabel = document.getElementById("highlightLabel");
const highlightFooterActions = document.getElementById(
  "highlightFooterActions",
);
const highlightLike = document.getElementById("highlightLike");
const highlightProgressBar = document.getElementById("highlightProgressBar");

const HIGHLIGHT_DURATION = 20;
let highlightInterval = null;

const highlightsData = {
  about: {
    label: { it: "info", en: "about" },
    title: { it: "Chi sono", en: "About me" },
    subtitle: {
      it: "Jr Web Developer · Founder @kāma",
      en: "Jr Web Developer · Founder @kāma",
    },
    html: (lang) => {
      const p = {
        it: [
          "Sono una <strong>Junior Frontend Developer</strong> con formazione Full Stack e un forte interesse per lo sviluppo web <strong>user-centred</strong>. Mi piace creare interfacce intuitive, ordinate, chiare e piacevoli da usare, con particolare attenzione a <strong>UX/UI</strong>, accessibilità e dettagli visivi.",
          "Ho anche conoscenze di base di database e tecnologie backend. Sono una sviluppatrice motivata, curiosa e attenta ai dettagli, desiderosa di continuare a imparare e crescere all'interno di un team di sviluppo professionale.",
        ],
        en: [
          "I'm a <strong>Junior Frontend Developer</strong> with Full Stack training and a strong interest in <strong>user-centred</strong> web development. I enjoy creating intuitive, well-organised, clear and pleasant to use interfaces, with particular attention to <strong>UX/UI</strong>, accessibility and visual details.",
          "I also have foundational knowledge of databases and backend technologies. I am a motivated, curious and detail-oriented developer, eager to continue learning and grow within a professional development team.",
        ],
      }[lang];

      const edu = {
        it: [
          {
            name: "Full Stack Web Development",
            place: "Accademia Code · 2024–2026",
            score: "98/100",
          },
          {
            name: "Cyber Security",
            place: "ICDL – AICA · 2026",
            score: "100/100",
          },
          {
            name: "Diploma Liceo Scientifico",
            place: "Liceo Scientifico M. Cipolla · 2012",
            score: "",
          },
        ],
        en: [
          {
            name: "Full Stack Web Development",
            place: "Accademia Code · 2024–2026",
            score: "98/100",
          },
          {
            name: "Cyber Security",
            place: "ICDL – AICA · 2026",
            score: "100/100",
          },
          {
            name: "High School Diploma",
            place: "Liceo Scientifico M. Cipolla · 2012",
            score: "    ",
          },
        ],
      }[lang];

      const langs = {
        it: [
          { name: "Italiano", level: "Madrelingua" },
          { name: "Inglese", level: "C1" },
          { name: "Spagnolo", level: "B2" },
          { name: "Francese", level: "B1" },
        ],
        en: [
          { name: "Italian", level: "Native" },
          { name: "English", level: "C1" },
          { name: "Spanish", level: "B2" },
          { name: "French", level: "B1" },
        ],
      }[lang];

      const eduTitle = lang === "it" ? "Formazione" : "Education";
      const langTitle = lang === "it" ? "Lingue" : "Languages";

      return `
        ${p.map((par) => `<p class="highlight-paragraph">${par}</p>`).join("")}
        <div class="highlight-block">
          <p class="highlight-block-title">${eduTitle}</p>
          ${edu
            .map(
              (e) => `
            <div class="highlight-block-row">
              <span><strong>${e.name}</strong><br><small style="color:var(--text-muted)">${e.place}</small></span>
              ${e.score ? `<span>${e.score}</span>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="highlight-block">
          <p class="highlight-block-title">${langTitle}</p>
          ${langs
            .map(
              (l) => `
            <div class="highlight-block-row">
              <span>${l.name}</span>
              <span>${l.level}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    },
  },

  contacts: {
    label: { it: "contatti", en: "contacts" },
    title: { it: "Contatti", en: "Contact" },
    subtitle: { it: "Parliamone", en: "Let's talk" },
    html: (lang) => {
      const intro =
        lang === "it"
          ? '<p class="highlight-paragraph">Scegli il canale che preferisci per contattarmi:</p>'
          : '<p class="highlight-paragraph">Pick the channel you prefer to reach me:</p>';

      const links = [
        {
          href: "https://linkedin.com/in/marikaguardi",
          icon: "img/icons/linkedin.svg",
          label: "LinkedIn",
        },
        {
          href: "https://wa.me/393770948721",
          icon: "img/icons/whatsapp.svg",
          label: "WhatsApp",
        },
        {
          href: "https://mail.google.com/mail/?view=cm&fs=1&to=ciao@aurwebdev.com",
          icon: "img/icons/email.svg",
          label: "Email",
        },
        {
          href: "https://github.com/marikaguardi",
          icon: "img/icons/github.png",
          label: "GitHub",
        },
      ];

      return `
        ${intro}
        <div class="highlight-contacts">
          ${links
            .map(
              (l) => `
            <a class="highlight-contact-link" href="${l.href}" target="_blank" rel="noopener noreferrer">
              <img src="${l.icon}" alt="${l.label}" width="20" height="20" />
              <span>${l.label}</span>
            </a>
          `,
            )
            .join("")}
        </div>
      `;
    },
  },

  stack: {
    label: { it: "stack", en: "stack" },
    title: { it: "Tech Stack", en: "Tech Stack" },
    subtitle: { it: "Tecnologie che uso", en: "Technologies I use" },
    html: (lang) => {
      const chips = [
        { name: "HTML", img: "img/skills/html.png" },
        { name: "CSS", img: "img/skills/css.png" },
        { name: "SCSS", img: "img/skills/sass.png" },
        { name: "JavaScript", img: "img/skills/javascript.png" },
        { name: "TypeScript", img: "img/skills/typescript.png" },
        { name: "PHP", img: "img/skills/php.png" },
        { name: "Laravel", img: "img/skills/laravel.png" },
        { name: "Bootstrap", img: "img/skills/bootstrap.png" },
        { name: "RxJS", img: "img/skills/rxjs.png" },
        { name: "Angular", img: "img/skills/angular.png" },
      ];

      const intro =
        lang === "it"
          ? '<p class="highlight-paragraph">Le tecnologie con cui lavoro quotidianamente, dal frontend al backend.</p>'
          : '<p class="highlight-paragraph">The technologies I work with every day, from frontend to backend.</p>';

      return `
        ${intro}
        <div class="highlight-chips">
          ${chips
            .map(
              (c) => `
            <span class="highlight-chip">
              <img src="${c.img}" alt="${c.name}" />
              ${c.name}
            </span>
          `,
            )
            .join("")}
        </div>
      `;
    },
  },

  work: {
    label: { it: "progetti", en: "projects" },
    title: { it: "I miei progetti", en: "My projects" },
    subtitle: { it: "Progetti recenti", en: "Recent projects" },
    html: (lang) => {
      const intro =
        lang === "it"
          ? '<p class="highlight-paragraph">Ecco i progetti a cui ho lavorato. Tocca uno per aprirlo.</p>'
          : '<p class="highlight-paragraph">Here are the projects I\'ve worked on. Tap one to open it.</p>';

      const projects = [
        {
          key: "kama",
          name: "kāma",
          desc: {
            it: "Sito web personalizzabile con dashboard",
            en: "Customizable website with dashboard",
          },
        },
        {
          key: "codex",
          name: "CodeX Streaming",
          desc: {
            it: "Piattaforma streaming con pannello admin",
            en: "Streaming platform with admin dashboard",
          },
        },
        {
          key: "swipe",
          name: "Swipe Cleaner",
          desc: {
            it: "App mobile per pulire la galleria",
            en: "Mobile app to clean your photo gallery",
          },
        },
        {
          key: "coinfarm",
          name: "Coin Farm",
          desc: {
            it: "Gioco arcade interattivo",
            en: "Interactive arcade game",
          },
        },
        {
          key: "oleificio",
          name: "Oleificio Lombardo",
          desc: {
            it: "Sito web per frantoio oleario",
            en: "Website for an olive oil mill",
          },
        },
      ];

      return `
      ${intro}
      <div class="highlight-projects">
        ${projects
          .map(
            (p) => `
          <a class="highlight-project-link" href="#" data-project="${p.key}">
            <span class="highlight-project-name">${p.name}</span>
            <span class="highlight-project-desc">${p.desc[lang]}</span>
          </a>
        `,
          )
          .join("")}
      </div>
    `;
    },
  },

  cv: {
    label: { it: "cv", en: "cv" },
    title: { it: "Curriculum", en: "Resume" },
    subtitle: { it: "Scarica il CV", en: "Download CV" },
    html: (lang) => {
      const text =
        lang === "it"
          ? '<p class="highlight-paragraph">Scarica il mio curriculum in formato PDF.</p>'
          : '<p class="highlight-paragraph">Download my resume in PDF format.</p>';
      return text;
    },
  },

  dm: {
    label: { it: "dm", en: "dm" },
    title: { it: "Parliamone", en: "Let's talk" },
    subtitle: { it: "Contattami direttamente", en: "Contact me directly" },
    html: (lang) => {
      const text =
        lang === "it"
          ? '<p class="highlight-paragraph">Sei un recruiter o hai un progetto in mente? Scrivimi e ti rispondo il prima possibile.</p>'
          : '<p class="highlight-paragraph">Are you a recruiter or have a project in mind? Write to me and I\'ll get back to you as soon as possible.</p>';
      return text;
    },
  },
};

function buildHighlightFooter(key) {
  const lang = currentLang();
  highlightFooterActions.innerHTML = "";

  if (key === "dm") {
    const openChatBtn = document.createElement("button");
    openChatBtn.type = "button";
    openChatBtn.className = "highlight-cta";
    openChatBtn.textContent = lang === "it" ? "Apri chat" : "Open chat";
    openChatBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeHighlight();
      setTimeout(() => openChat(), 250);
    });
    highlightFooterActions.appendChild(openChatBtn);

    const contactsLink = document.createElement("a");
    contactsLink.href = "#contacts";
    contactsLink.className = "highlight-cta ghost";
    contactsLink.textContent = lang === "it" ? "Contatti" : "Contacts";
    contactsLink.addEventListener("click", (e) => {
      e.preventDefault();
      closeHighlight();
      setTimeout(() => {
        openHighlight("contacts");
      }, 250);
    });
    highlightFooterActions.appendChild(contactsLink);
  }
}

function startHighlightProgress() {
  highlightProgressBar.style.width = "0%";
  clearInterval(highlightInterval);
  const start = Date.now();
  highlightInterval = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000;
    const percent = Math.min((elapsed / HIGHLIGHT_DURATION) * 100, 100);
    highlightProgressBar.style.width = percent + "%";
    if (percent >= 100) {
      clearInterval(highlightInterval);
      closeHighlight();
    }
  }, 50);
}

function buildCvButtons() {
  const lang = currentLang();

  const cvHref =
    lang === "it"
      ? "cv/cv-marika-guardi-italiano.pdf"
      : "cv/cv-marika-guardi-english.pdf";
  const cvLabel = lang === "it" ? "Scarica CV" : "Download CV";

  const certLabel =
    lang === "it" ? "Vedi i miei Certificati" : "View My Certificates";

  return `
    <div class="highlight-cv-actions">
      <a href="${cvHref}" download class="highlight-cta">${cvLabel}</a>

      <div class="highlight-certs">
        <span class="highlight-certs-label">${certLabel}</span>
        <div class="highlight-certs-row">
          <a href="cv/webdev.pdf" target="_blank" rel="noopener noreferrer" class="highlight-cta ghost">
            Web Dev Certificate
          </a>
          <a href="cv/ux-ui.pdf" target="_blank" rel="noopener noreferrer" class="highlight-cta ghost">
            UX-UI Certificate
          </a>
          <a href="cv/CyberSecurity.pdf" target="_blank" rel="noopener noreferrer" class="highlight-cta ghost">
            CyberSecurity Certificate
          </a>
        </div>
      </div>
    </div>

    <div class="highlight-cv-preview">
      <img src="cv/cv.jpg" alt="Anteprima CV" />
    </div>
  `;
}

function openHighlight(key) {
  const data = highlightsData[key];
  if (!data || !highlightOverlay) return;

  const lang = currentLang();

  highlightLabel.innerHTML =
    `<span class="lang-it">${data.label.it}</span>` +
    `<span class="lang-en">${data.label.en}</span>`;

  highlightContent.innerHTML = `
    <h2 class="highlight-title">${data.title[lang]}</h2>
    <p class="highlight-subtitle">${data.subtitle[lang]}</p>
    ${data.html(lang)}
    ${key === "cv" ? buildCvButtons() : ""}
  `;
  highlightContent.scrollTop = 0;

  buildHighlightFooter(key);

  if (highlightLike) highlightLike.classList.remove("liked");

  highlightOverlay.classList.add("open");
  highlightOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  startHighlightProgress();
}

function closeHighlight() {
  if (!highlightOverlay) return;
  highlightOverlay.classList.remove("open");
  highlightOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearInterval(highlightInterval);
  if (highlightProgressBar) highlightProgressBar.style.width = "0%";
  if (highlightLike) highlightLike.classList.remove("liked");
}

/* ============================================
   HIGHLIGHT PROGETTI → apre il Post Viewer
   ============================================ */
if (highlightContent) {
  highlightContent.addEventListener("click", (e) => {
    const link = e.target.closest("[data-project]");
    if (!link) return;

    e.preventDefault();
    e.stopPropagation();

    const projectKey = link.dataset.project;
    if (!projectKey || !projectsData[projectKey]) return;

    // Chiudi prima l'highlight, poi apri il post
    closeHighlight();
    setTimeout(() => openPost(projectKey), 250);
  });
}

document.querySelectorAll(".highlights .highlight").forEach((el) => {
  const key = el.dataset.highlight; // "about" | "contacts" | "stack" | "work" | "cv"
  if (!key || !highlightsData[key]) return;

  el.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      openHighlight(key);
    },
    true,
  );
});

if (highlightClose) highlightClose.addEventListener("click", closeHighlight);
if (highlightOverlay) {
  highlightOverlay.addEventListener("click", (e) => {
    if (e.target === highlightOverlay) closeHighlight();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && highlightOverlay.classList.contains("open")) {
    closeHighlight();
  }
});

if (highlightLike) {
  highlightLike.addEventListener("click", (e) => {
    e.stopPropagation();
    highlightLike.classList.toggle("liked");
    highlightLike.classList.remove("pop");
    void highlightLike.offsetWidth;
    highlightLike.classList.add("pop");
  });
}
