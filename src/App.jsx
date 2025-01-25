import { useState, useEffect } from 'react'
import { saveReadingProgress, getReadingProgress } from './utils/readingProgress'
import './App.css'

function App() {
  const [selectedSurah, setSelectedSurah] = useState('1')
  const [selectedVerse, setSelectedVerse] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('ar')
  const [selectedTranslator, setSelectedTranslator] = useState('')
  const [verses, setVerses] = useState([])
  const [translations, setTranslations] = useState({
    ar: [],
    en: [],
    ur: []
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [surahNames, setSurahNames] = useState([])
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem('quran-bookmarks') || '[]')
  )
  const [quickJumpVisible, setQuickJumpVisible] = useState(false)
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState(
    JSON.parse(localStorage.getItem('quran-bookmarked-surahs') || '[]')
  )
  const [showGuide, setShowGuide] = useState(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore')
    if (!hasVisited) {
      localStorage.setItem('hasVisitedBefore', 'true')
      return true
    }
    return false
  })

  // Add bookmark toggle function
  const toggleSurahBookmark = (surahNumber) => {
    const newBookmarks = bookmarkedSurahs.includes(surahNumber)
      ? bookmarkedSurahs.filter(s => s !== surahNumber)
      : [...bookmarkedSurahs, surahNumber]
    setBookmarkedSurahs(newBookmarks)
    localStorage.setItem('quran-bookmarked-surahs', JSON.stringify(newBookmarks))
  }

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const arabicData = await import('./json/arabic.json')
      const englishData = await import('./json/en.sahih.json')
      const urduData = await import('./json/ur.maududi.json')
      const surahData = await import('./json/surah.name.json')
      
      setTranslations({
        ar: arabicData.default,
        en: englishData.default,
        ur: urduData.default
      })
      setSurahNames(surahData.default.surahs)
    }
    loadData()
  }, [])

  // Filter verses when surah changes
  useEffect(() => {
    if (selectedSurah && translations.ar.length > 0) {
      const filtered = translations.ar.filter(verse => 
        verse.surah === parseInt(selectedSurah) &&
        (!selectedVerse || verse.verse === parseInt(selectedVerse))
      )
      setVerses(filtered)
    }
  }, [selectedSurah, selectedVerse, translations])

  // Handle scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const verseElements = document.querySelectorAll('.verse-card')
      let currentVerse = null
      
      verseElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentVerse = element.dataset.verse
        }
      })

      if (currentVerse) {
        saveReadingProgress(selectedSurah, currentVerse, window.scrollY)
      }
    }

    let scrollTimeout
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', debouncedScroll)
    return () => window.removeEventListener('scroll', debouncedScroll)
  }, [selectedSurah])

  // Restore scroll position when verses load
  useEffect(() => {
    if (verses.length > 0) {
      const progress = getReadingProgress(selectedSurah)
      if (progress) {
        setTimeout(() => {
          window.scrollTo({
            top: progress.scrollPosition,
            behavior: 'smooth'
          })
        }, 100)
      }
    }
  }, [verses])

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Enhanced QuickJumpPanel component
  const QuickJumpPanel = ({ onClose }) => {
    const [activeCategory, setActiveCategory] = useState('All')
    
    return (
      <div className="quick-jump-panel">
        <div className="quick-jump-header">
          <h3>Quick Navigation</h3>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="bookmarks-section">
          <div className="section-title">
            <h4>Bookmarked Surahs</h4>
          </div>
          {bookmarkedSurahs.map(surahNum => {
            const surah = surahNames.find(s => s.number === surahNum)
            return surah && (
              <button
                key={surahNum}
                className="bookmark-item"
                onClick={() => {
                  setSelectedSurah(surahNum.toString())
                  onClose()
                }}
              >
                <span className="bookmark-number">{surahNum}</span>
                <span className="bookmark-name">{surah.name}</span>
                <span className="bookmark-translation">{surah.translation}</span>
              </button>
            )
          })}
        </div>

        <div className="quick-links">
          <div className="section-title">
            <h4>Popular Surahs</h4>
          </div>
          <div className="quick-links-grid">
            {[
              { number: 1, name: 'Al-Fatiha' },
              { number: 36, name: 'Yasin' },
              { number: 67, name: 'Al-Mulk' },
              { number: 78, name: 'An-Naba' },
              { number: 55, name: 'Ar-Rahman' },
              { number: 56, name: 'Al-Waqiah' }
            ].map(surah => (
              <button 
                key={surah.number}
                className="quick-link-btn"
                onClick={() => {
                  setSelectedSurah(surah.number.toString())
                  onClose()
                }}
              >
                <span className="surah-number">{surah.number}</span>
                <span className="surah-name">{surah.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quran-app">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Surahs</h2>
          <button 
            className="close-sidebar"
            onClick={handleCloseSidebar}
          >
            ×
          </button>
        </div>
        <div className="sidebar-content">
          {surahNames.map((surah) => (
            <div key={surah.number} className="surah-item">
              <button
                className={`surah-btn ${selectedSurah === surah.number.toString() ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSurah(surah.number.toString())
                  handleCloseSidebar()
                }}
              >
                <span className="surah-number">{surah.number}</span>
                <div className="surah-info">
                  <span className="surah-name">{surah.name}</span>
                  <span className="surah-translation">{surah.translation}</span>
                </div>
              </button>
              <button 
                className="bookmark-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSurahBookmark(surah.number)
                }}
              >
                {bookmarkedSurahs.includes(surah.number) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="main-section">
        <nav className={`top-nav ${selectedLanguage !== 'ar' ? 'has-translation' : ''}`}>
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="logo">
  <img 
    src="/src/assets/quranlogo.png" 
    alt="Quran App" 
    onClick={() => window.location.reload()}
    style={{ cursor: 'pointer' }}
  />
</div>


          <div className="nav-controls">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="lang-select"
            >
              <option value="ar">عربي</option>
              <option value="en">English</option>
              <option value="ur">اردو</option>
            </select>

            {selectedLanguage !== 'ar' && (
              <select
                value={selectedTranslator}
                onChange={(e) => setSelectedTranslator(e.target.value)}
                className="translator-select"
              >
                {[...new Set(translations[selectedLanguage]
                  .map(t => t.translator))]
                  .map(translator => (
                    <option key={translator} value={translator}>
                      {translator}
                    </option>
                ))}
              </select>
            )}
          </div>
        </nav>

        <div className="content">
          <div className="verse-controls">
            <div className="controls-wrapper">
              <select
                value={selectedVerse}
                onChange={(e) => setSelectedVerse(e.target.value)}
                className="verse-select"
              >
                <option value="">Select Verse</option>
                {[...Array(Math.ceil(verses.length / 10))].map((_, groupIndex) => (
                  <optgroup 
                    key={groupIndex} 
                    label={`Verses ${groupIndex * 10 + 1} - ${Math.min((groupIndex + 1) * 10, verses.length)}`}
                  >
                    {verses
                      .slice(groupIndex * 10, (groupIndex + 1) * 10)
                      .map(verse => (
                        <option key={verse.verse} value={verse.verse}>
                          Verse {verse.verse}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <button 
                className="quick-jump-btn"
                onClick={() => setQuickJumpVisible(true)}
              >
                Quick Jump
              </button>
            </div>
          </div>

          {quickJumpVisible && (
            <QuickJumpPanel onClose={() => setQuickJumpVisible(false)} />
          )}

          <div className="verses-container">
            {verses.map(verse => (
              <div 
                key={`${verse.surah}-${verse.verse}`}
                className="verse-card"
                data-verse={verse.verse}
              >
                <div className="verse-header">
                  <span className="verse-number">{verse.verse}</span>
                </div>
                
                <div className="verse-arabic" dir="rtl">
                  {verse.text}
                </div>
                  {selectedLanguage !== 'ar' && (
                    <div 
                      className="verse-translation"
                      lang={selectedLanguage}
                      dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}
                    >
                      {translations[selectedLanguage]?.find(
                        t => t.surah === verse.surah && 
                            t.verse === verse.verse &&
                            (!selectedTranslator || t.translator === selectedTranslator)
                      )?.text || ''}
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      </main>

      {showGuide && (
        <div className="guide-popup">
          <div className="guide-content">
            <div className="guide-arrow">↖</div>
            <p>Click the menu icon to explore Surahs</p>
            <button 
              className="guide-close"
              onClick={() => setShowGuide(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
