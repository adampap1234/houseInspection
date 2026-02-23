import { useTranslation } from 'react-i18next'

/**
 * Compact inline contact strip with phone and email.
 * Replaces the generic CTA button in service/content sections.
 */
export function ContactStrip() {
  const { t } = useTranslation()
  const phone = t('contact.phone')
  const email = t('contact.emailAddress')

  return (
    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
      <p className="text-text-secondary/60 text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3">
        {t('contact.label')}
      </p>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {/* Phone */}
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="group flex items-center gap-2 text-text-primary hover:text-accent transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm font-medium">{phone}</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="group flex items-center gap-2 text-text-primary hover:text-accent transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm font-medium">{email}</span>
        </a>
      </div>
    </div>
  )
}
