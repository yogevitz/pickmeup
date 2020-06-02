import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Translations_EN from './assets/locale/en.json';
import Translations_HE from './assets/locale/he.json';

const resources = {
  en: {
    translation: Translations_EN,
  },
  he: {
    translation: Translations_HE,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "he",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;