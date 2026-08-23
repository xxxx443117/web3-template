import { createI18n } from "vue-i18n";
import en from "./locale/en.json";
import zh from "./locale/zh.json";

import zhLogo from "@/assets/images/flag/China.png";
import enLogo from "@/assets/images/flag/English.png";

const messages = { en, zh };

export const langList = [
  { name: "English", value: "en", logo: enLogo },
  { name: "中文简体", value: "zh", logo: zhLogo },
  // Add more languages here following the same pattern
];

const language = (navigator.language || "en").toLocaleLowerCase();

export const LOCAL_STORAGE_KEY = "language";

const i18n = createI18n({
  legacy: false,
  locale: sessionStorage.getItem(LOCAL_STORAGE_KEY) || language.split("-")[0] || "en",
  fallbackLocale: "en",
  globalInjection: true,
  messages,
});

export default i18n;
