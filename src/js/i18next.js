import i18next from "i18next";

const translationFiles = import.meta.glob('../locales/**/*.json', {
  eager: true
});

async function loadTranslations(lang) {
  const filePath = `../locales/${lang}/translation.json`;

  if (translationFiles[filePath]) {
    console.log(`Loaded translations for ${lang}:`, translationFiles[filePath].default);
    return translationFiles[filePath].default;
  } else {
    console.error(`Translation file not found for lang: ${lang}`);
    return {};
  }
}

function updateContent() {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = i18next.t(key);
  });
}

function setActiveButton(lang) {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const btn = document.getElementById(`lang-${lang}`);
  if (btn) btn.classList.add("active");
}

async function initI18n(lang = "uk") {
  const translations = await loadTranslations(lang);

  await i18next.init({
    lng: lang,
    resources: {
      [lang]: { translation: translations }
    },
    fallbackLng: "en",
    debug: false
  });

  updateContent();
}

// Клік по кнопці мови
document.getElementById("lang-uk").addEventListener("click", async () => {
  await initI18n("uk");
  localStorage.setItem("lang", "uk");
  setActiveButton("uk");
});

document.getElementById("lang-en").addEventListener("click", async () => {
  await initI18n("en");
  localStorage.setItem("lang", "en");
  setActiveButton("en");
});

// Початкова мова
const savedLang = localStorage.getItem("lang") || "uk";

initI18n(savedLang).then(() => {
  setActiveButton(savedLang);
});
