interface Translation {
  [key: string]: string;
}

interface Translations {
  en: Translation;
}

const DEFAULT_LANGUAGE: string = 'en';

const SUPPORTED_LANGUAGES: string[] = ['en'];

const TRANSLATIONS: Translations = {
  en: {
    text: 'payments of',
    textGracePeriod: 'interest-free payments of',
    learnMore: 'Learn more',
  },
};

export const translate = (key: string, lang?: string): string => {
  const language: string | undefined = lang;
  return TRANSLATIONS[language !== undefined && SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE][key];
};
