import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Pause, BookOpen, Share2, Copy } from 'lucide-react'
import VerseCard from './VerseCard'
import ReadingProgress from './ReadingProgress'
import { useLocalStorage } from '../hooks/useLocalStorage'

const QuranReader = ({ settings, onSettingsChange }) => {
  const { surahId, verseId } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  
  const [currentSurah, setCurrentSurah] = useState(parseInt(surahId) || 1)
  const [verses, setVerses] = useState([])
  const [translations, setTranslations] = useState({})
  const [surahInfo, setSurahInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [readingProgress, setReadingProgress] = useLocalStorage('reading-progress', {})
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)

  // Load Quran data
  useEffect(() => {
    const loadQuranData = async () => {
      setIsLoading(true)
      try {
        const [arabicData, englishData, urduData, surahData] = await Promise.all([
          import('../json/arabic.json'),
          import('../json/en.sahih.json'),
          import('../json/ur.maududi.json'),
          import('../json/surah.name.json')
        ])

        setTranslations({
          ar: arabicData.default,
          en: englishData.default,
          ur: urduData.default
        })

        const surahInfo = surahData.default.surahs.find(s => s.number === currentSurah)
        setSurahInfo(surahInfo)

        // Filter verses for current surah
        const surahVerses = arabicData.default.filter(verse => verse.surah === currentSurah)
        setVerses(surahVerses)

      } catch (error) {
        console.error('Failed to load Quran data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuranData()
  }, [currentSurah])

  // Sync URL with current surah
  useEffect(() => {
    const urlSurah = parseInt(surahId)
    if (surahId && urlSurah !== currentSurah && urlSurah >= 1 && urlSurah <= 114) {
      setCurrentSurah(urlSurah)
    } else if (!surahId && currentSurah !== 1) {
      navigate(`/surah/${currentSurah}`, { replace: true })
    }
  }, [surahId, navigate])

  // Scroll to specific verse
  useEffect(() => {
    if (verseId && verses.length > 0) {
      const verseElement = document.getElementById(`verse-${verseId}`)
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [verseId, verses])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !settings.autoScroll) return

    const interval = setInterval(() => {
      window.scrollBy({ top: 50, behavior: 'smooth' })
    }, 2000)

    return () => clearInterval(interval)
  }, [isAutoScrolling, settings.autoScroll])

  const handleSurahChange = useCallback((newSurah) => {
    if (newSurah >= 1 && newSurah <= 114) {
      setCurrentSurah(newSurah)
    }
  }, [])

  const handlePreviousSurah = () => {
    if (currentSurah > 1) {
      handleSurahChange(currentSurah - 1)
    }
  }

  const handleNextSurah = () => {
    if (currentSurah < 114) {
      handleSurahChange(currentSurah + 1)
    }
  }

  const handleVerseClick = (verseNumber) => {
    navigate(`/surah/${currentSurah}/verse/${verseNumber}`)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/surah/${currentSurah}`
    try {
      await navigator.share({
        title: `${surahInfo?.name} - ${surahInfo?.translation}`,
        url: url
      })
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(url)
    }
  }

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling)
  }

  if (isLoading) {
    return (
      <div className="reader-loading">
        <div className="loading-spinner"></div>
        <p>Loading Surah...</p>
      </div>
    )
  }

  return (
    <div className="quran-reader" ref={containerRef}>
      {/* Surah Header */}
      <div className="surah-header">
        <div className="surah-header-content">
          <div className="surah-info">
            <div className="surah-meta">
              <span className="header-surah-number">Surah {currentSurah}</span>
              <span className="verse-count">{verses.length} verses</span>
            </div>
            <h1 className="surah-title">
              <span className="surah-name">{surahInfo?.name}</span>
              <span className="surah-translation">{surahInfo?.translation}</span>
            </h1>
          </div>

          <div className="surah-actions">
            <button
              onClick={handleShare}
              className="btn btn-ghost btn-sm"
              aria-label="Share surah"
            >
              <Share2 size={16} />
            </button>
            
            <button
              onClick={toggleAutoScroll}
              className={`btn btn-ghost btn-sm ${isAutoScrolling ? 'active' : ''}`}
              aria-label="Toggle auto scroll"
            >
              {isAutoScrolling ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="surah-navigation">
          <button
            onClick={handlePreviousSurah}
            disabled={currentSurah === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <select
            value={currentSurah}
            onChange={(e) => handleSurahChange(parseInt(e.target.value))}
            className="surah-select"
          >
            {Array.from({ length: 114 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                Surah {num}
              </option>
            ))}
          </select>

          <button
            onClick={handleNextSurah}
            disabled={currentSurah === 114}
            className="btn btn-secondary btn-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>



      {/* Verses */}
      <div className="verses-container">
        {verses.map((verse, index) => (
          <VerseCard
            key={`${verse.surah}-${verse.verse}`}
            verse={verse}
            translations={translations}
            settings={settings}
            isHighlighted={verseId === verse.verse.toString()}
            onClick={() => handleVerseClick(verse.verse)}
            index={index}
          />
        ))}
      </div>

      {/* Reading Progress */}
      <ReadingProgress
        currentSurah={currentSurah}
        totalVerses={verses.length}
        progress={readingProgress}
        onProgressUpdate={setReadingProgress}
      />
    </div>
  )
}

export default QuranReader