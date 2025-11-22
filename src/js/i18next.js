// =================================================================
// src/js/i18next.js - Оновлення для роботи на Vercel/GitHub Pages
// =================================================================
import i18next from "i18next";

/**
 * Функція для завантаження перекладів.
 * Використовує fetch і import.meta.env.BASE_URL для коректного визначення шляху
 * до статичних файлів у папці public, незалежно від середовища розгортання.
 * * ПЕРЕДУМОВА: Папка 'locales' ПОВИННА знаходитися в 'public' (тобто 'public/locales/').
 *
 * @param {string} lang - Код мови ('uk', 'en').
 * @returns {Promise<Object>} - Об'єкт перекладів або порожній об'єкт у разі помилки.
 */
async function loadTranslations(lang) {
  // BASE_URL - це або '/' (локально), або '/<repo-name>/' (на GitHub Pages).
  const baseUrl = import.meta.env.BASE_URL;

  // Формуємо шлях до файлу: /<repo-name>/locales/uk/translation.json
  const path = `${baseUrl}locales/${lang}/translation.json`;

  console.log(`Attempting fetch for: ${path}`);

  try {
    const response = await fetch(path);

    if (!response.ok) {
      // Якщо 404, викидаємо помилку для обробки в catch
      throw new Error(`Failed to load translation: ${response.status} for path: ${path}`);
    }

    // Парсимо JSON
    const translations = await response.json();

    return translations;
  } catch (error) {
    console.error(`Error during fetch for ${lang}. Check file location in public/locales/:`, error);
    return {};
  }
}

// Оновлення текстового контенту на сторінці
function updateContent() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");

    // Обробка поля вводу (placeholder) та іншого тексту (textContent)
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = i18next.t(key);
    } else {
      el.textContent = i18next.t(key);
    }
  });
}

// Встановлення активного стилю для кнопки мови
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

// Ініціалізація i18next
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

  // Додаємо обробник подій
  i18next.off('languageChanged', updateContent);
  i18next.on('languageChanged', updateContent);

  updateContent();
}

// Точка входу: Ініціалізація та обробники подій кнопок
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

  // Ініціалізація зі збереженою або типовою мовою
  const savedLang = localStorage.getItem("lang") || "uk";
  initI18n(savedLang).then(() => {
    setActiveButton(savedLang);
  });
});
// =================================================================