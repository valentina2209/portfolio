import i18next from "i18next";

async function loadTranslations(lang) {
  const path = `../locales/${lang}/translation.json`;

  try {
    const module = await import(/* @vite-ignore */ path);
    return module.default;
  } catch (error) {
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
  const button = document.getElementById(`lang-${lang}`);
  if (button) {
    button.classList.add("active");
  } else {
    console.warn(`Language button with id 'lang-${lang}' not found.`);
  }
}

async function initI18n(lang = "uk") {
  const translations = await loadTranslations(lang);

  await i18next.init({
    lng: lang,
    resources: {
      [lang]:
        { translation: translations },
    },
    fallbackLng: "en",
    debug: true,
    defaultNS: 'translation',
  });
  updateContent();
}

document.getElementById("lang-uk").addEventListener("click", async () => {
  await initI18n("uk");
  localStorage.setItem("lang", "uk");
  setActiveButton("uk")
});

document.getElementById("lang-en").addEventListener("click", async () => {
  await initI18n("en");
  localStorage.setItem("lang", "en");
  setActiveButton("en");
});

const savedLang = localStorage.getItem("lang") || "uk";
initI18n(savedLang).then(() => {
  setActiveButton(savedLang);
});