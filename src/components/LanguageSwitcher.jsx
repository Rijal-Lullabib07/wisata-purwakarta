import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage, LANGUAGES } from "../i18n/LanguageContext";

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  /* Tutup saat klik di luar komponen */
  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const pilih = useCallback(
    (code) => {
      setLang(code);
      setOpen(false);
    },
    [setLang],
  );

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className={`lang-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Bahasa: ${current.label}`}
        title={current.label}
      >
        <span className="lang-current">{current.short}</span>
        <span className="lang-caret" aria-hidden="true" />
      </button>

      <div
        className={`lang-menu ${open ? "open" : ""}`}
        role="listbox"
        aria-label="Pilih bahasa"
      >
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            type="button"
            role="option"
            aria-selected={language.code === lang}
            className={`lang-option ${language.code === lang ? "active" : ""}`}
            onClick={() => pilih(language.code)}
          >
            <span className="lang-check" aria-hidden="true">
              {language.code === lang ? "✓" : ""}
            </span>
            <span className="lang-name">{language.label}</span>
            <span className="lang-code">{language.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
