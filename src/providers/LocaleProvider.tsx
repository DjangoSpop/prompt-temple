"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { setCookie, getCookie } from 'cookies-next'

interface LocaleContextType {
  locale: string
  setLocale: (locale: string) => void
  dir: 'ltr' | 'rtl'
  t: (key: string, namespace?: string) => string
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
  dir: 'ltr',
  t: () => '',
})

type Translations = Record<string, unknown>

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<Translations>({})
  const [locale, setLocaleState] = useState((getCookie('NEXT_LOCALE') as string) || 'en')
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    // Load translations
    const loadTranslations = async () => {
      try {
        const commonTranslations = await fetch(`/locales/${locale}/common.json`).then(res => res.json())
        setTranslations(commonTranslations)
      } catch (error) {
        console.error('Failed to load translations:', error)
      }
    }
    loadTranslations()
  }, [locale])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    setCookie('NEXT_LOCALE', newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    // In App Router, locale routing is typically handled via i18n libs.
    // We avoid programmatic navigation here to keep compatibility.
  }

  const t = (key: string, namespace = 'common') => {
    const keys = key.split('.')
    let current: unknown = translations

    for (const k of keys) {
      if (
        current === null ||
        typeof current !== 'object' ||
        !(k in (current as Record<string, unknown>))
      ) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
      current = (current as Record<string, unknown>)[k]
    }

    return typeof current === 'string' ? current : key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
