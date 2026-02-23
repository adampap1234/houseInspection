import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Scene } from './components/Scene'
import { LoadingScreen } from './components/LoadingScreen'
import { ContentSectionLayer } from './components/ContentSectionLayer'
import { ScrollCue } from './components/ScrollCue'
import { StickyCta } from './components/StickyCta'
import { CameraDebugHud } from './components/CameraDebug'
import { useScrollListener } from './hooks/useScrollListener'

const isDebugCamera = new URLSearchParams(window.location.search).get('debug') === 'camera'

function App() {
  const { i18n } = useTranslation()
  useScrollListener()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <>
      <Scene />
      <LoadingScreen />
      {isDebugCamera && <CameraDebugHud />}
      {!isDebugCamera && <ContentSectionLayer />}
      {!isDebugCamera && <ScrollCue />}
      {!isDebugCamera && <StickyCta />}
      <div className={`relative z-10 text-text-primary ${isDebugCamera ? 'hidden' : ''}`}>
        <header className="sticky top-0 z-40 flex items-center justify-end p-4 md:p-6">
          <LanguageSwitcher />
        </header>
        <main className="min-h-[700vh]" />
      </div>
    </>
  )
}

export default App
