import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'hu', label: 'HU' },
  { code: 'en', label: 'EN' },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => void i18n.changeLanguage(lang.code)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
            i18n.language === lang.code
              ? 'bg-accent text-background'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`}
          aria-label={`Switch to ${lang.code === 'hu' ? 'Hungarian' : 'English'}`}
          aria-current={i18n.language === lang.code ? 'true' : undefined}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
