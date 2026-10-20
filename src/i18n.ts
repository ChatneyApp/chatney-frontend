import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.yml';
import ru from '@/locales/ru.yml';
import uk from '@/locales/uk.yml';

i18n.on('languageChanged', (language) => {
    // `language` is the raw browser tag (e.g. "ru-RU"); `resolvedLanguage` is the locale actually in use.
    document.documentElement.lang = i18n.resolvedLanguage ?? language;
});

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ru: { translation: ru },
            uk: { translation: uk },
        },
        supportedLngs: ['en', 'ru', 'uk'],
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        fallbackLng: 'en',
        // Browser settings only; there is no manual language selector yet, so nothing is persisted.
        detection: { order: ['navigator'], caches: [] },
        interpolation: { escapeValue: false },
    });

export default i18n;
