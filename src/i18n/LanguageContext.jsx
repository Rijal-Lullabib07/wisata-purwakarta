import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { translations } from './translations'

const LANGUAGE_KEY = 'pw-lang'
const SUPPORTED = ['id', 'su', 'en']

export const LANGUAGES = [
  { code: 'id', label: 'Indonesia', short: 'ID' },
  { code: 'su', label: 'Sunda', short: 'SU' },
  { code: 'en', label: 'English', short: 'EN' },
]

const LanguageContext = createContext(null)

function detectInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    if (saved && SUPPORTED.includes(saved)) return saved
    const nav = (navigator.language || 'id').slice(0, 2).toLowerCase()
    return SUPPORTED.includes(nav) ? nav : 'id'
  } catch {
    return 'id'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLanguage)

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, lang)
    } catch {
      /* private mode — abaikan */
    }
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key, vars) => {
      let str = translations[lang]?.[key] ?? translations.id[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v))
        }
      }
      return str
    },
    [lang],
  )

  /* Value di-memoize: tanpa ini objek context baru setiap render membuat
     seluruh tree ikut re-render setiap kali Provider render → di HPlow-end
     terasa seperti UI "nyangkut" saat ganti bahasa. */
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage harus dipakai di dalam <LanguageProvider>')
  return ctx
}
