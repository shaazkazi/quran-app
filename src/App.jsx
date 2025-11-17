import { useState, useEffect, useCallback, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import QuranReader from './components/QuranReader'
import SearchModal from './components/SearchModal'
import SettingsModal from './components/SettingsModal'
import LoadingScreen from './components/LoadingScreen'
import { useLocalStorage } from './hooks/useLocalStorage'
import { QuranProvider } from './context/QuranContext'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  // Settings with localStorage persistence
  const [settings, setSettings] = useLocalStorage('quran-settings', {
    theme: 'dark',
    language: 'ar',
    translation: 'en',
    translator: 'sahih',
    fontSize: 'medium',
    arabicFont: 'uthmanic',
    showTransliteration: false,
    autoScroll: false,
    nightMode: false
  })

  // Load initial data
  useEffect(() => {
    const loadApp = async () => {
      try {
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load app:', error)
        setIsLoading(false)
      }
    }
    loadApp()
  }, [])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
    if (settings.nightMode) {
      document.documentElement.classList.add('night-mode')
    } else {
      document.documentElement.classList.remove('night-mode')
    }
  }, [settings.theme, settings.nightMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            setIsSearchOpen(true)
            break
          case ',':
            e.preventDefault()
            setIsSettingsOpen(true)
            break
        }
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsSettingsOpen(false)
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [setSettings])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <QuranProvider>
      <Router>
        <div className="app" data-theme={settings.theme}>
          <Header 
            onMenuClick={toggleSidebar}
            onSearchClick={() => setIsSearchOpen(true)}
            onSettingsClick={() => setIsSettingsOpen(true)}
            settings={settings}
            onSettingsChange={updateSettings}
          />
          
          <div className="app-body">
            <Sidebar 
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
              settings={settings}
            />
            
            <main className="main-content">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <QuranReader 
                      settings={settings}
                      onSettingsChange={updateSettings}
                    />
                  } 
                />
                <Route 
                  path="/surah/:surahId" 
                  element={
                    <QuranReader 
                      settings={settings}
                      onSettingsChange={updateSettings}
                    />
                  } 
                />
                <Route 
                  path="/surah/:surahId/verse/:verseId" 
                  element={
                    <QuranReader 
                      settings={settings}
                      onSettingsChange={updateSettings}
                    />
                  } 
                />
              </Routes>
            </main>
          </div>

          {/* Modals */}
          <SearchModal 
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            settings={settings}
          />
          
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSettingsChange={updateSettings}
          />

          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}
        </div>
      </Router>
    </QuranProvider>
  )
}

export default App