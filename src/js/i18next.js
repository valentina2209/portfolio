import i18next from "i18next";

async function loadTranslations(lang) {
  const pathPrefix = './../locales/';
  const fullPath = `${pathPrefix}${lang}/translation.json`;

  try {
    const module = await import(/* @vite-ignore */ fullPath);
    return module.default;
  } catch (error) {
    return {};
  }
}

function updateContent() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = i18next.t(key);
    } else {
      el.textContent = i18next.t(key);
    }
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

  if (Object.keys(translations).length === 0) {
    console.warn("Translations object is empty. Interface keys might be missing.");
  }

  await i18next.init({
    lng: lang,
    resources: {
      [lang]: { translation: translations },
    },
    fallbackLng: "en",
    debug: true,
    defaultNS: 'translation',
  });

  i18next.off('languageChanged', updateContent);
  i18next.on('languageChanged', updateContent);

  updateContent();
}

document.addEventListener('DOMContentLoaded', () => {
  const ukBtn = document.getElementById("lang-uk");
  const enBtn = document.getElementById("lang-en");

  if (ukBtn) {
    ukBtn.addEventListener("click", async () => {
      await initI18n("uk");
      localStorage.setItem("lang", "uk");
      setActiveButton("uk");
    });
  }

  if (enBtn) {
    enBtn.addEventListener("click", async () => {
      await initI18n("en");
      localStorage.setItem("lang", "en");
      setActiveButton("en");
    });
  }

  const savedLang = localStorage.getItem("lang") || "uk";
  initI18n(savedLang).then(() => {
    setActiveButton(savedLang);
  });
});