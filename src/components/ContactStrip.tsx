import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PricingModal } from './PricingModal'

const phoneIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const emailIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const priceIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const pillClass =
  'flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs sm:text-sm font-medium transition-colors pointer-events-auto'

/**
 * Contact strip with three styled pill buttons: call, email, pricing.
 */
export function ContactStrip() {
  const { t } = useTranslation()
  const phone = t('contact.phone')
  const email = t('contact.emailAddress')
  const [pricingOpen, setPricingOpen] = useState(false)

  return (
    <>
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
        <p className="text-text-secondary/60 text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 text-center">
          {t('contact.label')}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Phone */}
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className={`${pillClass} bg-accent hover:bg-accent-hover text-background`}
          >
            {phoneIcon}
            <span className="hidden sm:inline">{t('contact.callLabel')}</span>
            <span className="sm:hidden">{t('contact.callLabel')}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className={`${pillClass} border border-accent/40 text-accent hover:bg-accent/10`}
          >
            {emailIcon}
            <span className="hidden sm:inline">{t('contact.emailLabel')}</span>
            <span className="sm:hidden">{t('contact.emailLabel')}</span>
          </a>

          {/* Pricing */}
          <button
            onClick={() => setPricingOpen(true)}
            className={`${pillClass} border border-white/10 text-text-primary hover:bg-white/5 cursor-pointer`}
          >
            {priceIcon}
            <span>{t('pricing.button')}</span>
          </button>
        </div>
      </div>

      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </>
  )
}
