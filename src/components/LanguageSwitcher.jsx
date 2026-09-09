import { useLanguage, LANGUAGES } from "../i18n/LanguageContext";

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-switcher" role="group" aria-label="Pilih bahasa">
      <span className="lang-globe" aria-hidden="true">
        ◎
      </span>
      <div className="lang-options">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            type="button"
            className={`lang-option ${language.code === lang ? "active" : ""}`}
            onClick={() => setLang(language.code)}
            aria-pressed={language.code === lang}
            title={language.label}
          >
            {language.short}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
