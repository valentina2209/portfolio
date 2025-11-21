import i18next from "i18next";

async function loadTranslations(lang) {
  // Використовуємо динамічний import, який Vite може обробити
  // Шлях відносний до i18next.js, який знаходиться в src/js/
  const path = `../locales/${lang}/translation.json`;
  console.log('Attempting to load translations via dynamic import from:', path);
  try {
    const translationsModule = await import(path);
    // JSON файли зазвичай експортуються як default
    const translations = translationsModule.default;
    console.log('Successfully loaded translations for', lang, ':', translations);
    return translations;
  } catch (error) {
    console.error('Error loading translations via dynamic import for', lang, ':', error);
    return {}; // Повернути порожній об'єкт у випадку помилки
  }
}

// Усі функції повинні бути оголошені на верхньому рівні модуля
function updateContent() {
  console.log('Updating content...');
  const elements = document.querySelectorAll("[data-i18n]");
  console.log('Found elements with data-i18n:', elements.length);

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translatedText = i18next.t(key);
    console.log(`Translating key "${key}": "${translatedText}"`);
    el.textContent = translatedText;
  });
}

function setActiveButton(lang) {
  console.log('Setting active button for:', lang); // <-- Додано
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  const button = document.getElementById(`lang-${lang}`);
  if (button) { // Перевірка, щоб уникнути помилок, якщо кнопки не знайдено
    button.classList.add("active");
  } else {
    console.warn(`Language button with id 'lang-${lang}' not found.`);
  }
}

async function initI18n(lang = "uk") {
  console.log('Initializing i18n for language:', lang);
  const translations = await loadTranslations(lang);

  if (Object.keys(translations).length === 0) {
    console.warn('No translations loaded for', lang, '. i18next might not work correctly.');
    // Можливо, тут варто повернутися до мови за замовчуванням або вивести повідомлення користувачу.
  }

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
  console.log('i18next initialized for', lang);
  updateContent();
}


// Обробники подій та початкова ініціалізація
// Цей блок має виконуватися після того, як DOM повністю завантажений.
// Оскільки ви імпортуєте i18next.js як модуль, він виконується після парсингу DOM.

document.getElementById("lang-uk").addEventListener("click", async () => {
  console.log('UK button clicked');
  await initI18n("uk");
  localStorage.setItem("lang", "uk");
  setActiveButton("uk")
});

document.getElementById("lang-en").addEventListener("click", async () => {
  console.log('EN button clicked');
  await initI18n("en");
  localStorage.setItem("lang", "en");
  setActiveButton("en");
});

// Початкова ініціалізація
const savedLang = localStorage.getItem("lang") || "uk";
console.log('Initial language from localStorage:', savedLang);
// Викликаємо initI18n, а потім в then() викликаємо setActiveButton
initI18n(savedLang).then(() => {
  setActiveButton(savedLang);
});