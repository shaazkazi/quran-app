import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Copy, Share2, Bookmark, BookmarkCheck } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const VerseCard = ({ 
  verse, 
  translations, 
  settings, 
  isHighlighted, 
  onClick, 
  index 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bookmarks, setBookmarks] = useLocalStorage('verse-bookmarks', [])
  const [showActions, setShowActions] = useState(false)
  const cardRef = useRef(null)
  const audioRef = useRef(null)

  const verseKey = `${verse.surah}-${verse.verse}`
  const isBookmarked = bookmarks.includes(verseKey)

  // Get translation text
  const getTranslation = (lang) => {
    if (lang === 'ar') return verse.text
    
    const translationData = translations[lang]
    if (!translationData) return ''
    
    const translation = translationData.find(
      t => t.surah === verse.surah && t.verse === verse.verse
    )
    return translation?.text || ''
  }

  // Handle audio playback
  const toggleAudio = async (e) => {
    e.stopPropagation()
    
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      // TODO: Implement audio loading and playback
      setIsPlaying(true)
      // Simulate audio duration
      setTimeout(() => setIsPlaying(false), 3000)
    }
  }

  // Handle bookmark toggle
  const toggleBookmark = (e) => {
    e.stopPropagation()
    setBookmarks(prev => 
      prev.includes(verseKey)
        ? prev.filter(key => key !== verseKey)
        : [...prev, verseKey]
    )
  }

  // Handle copy verse
  const copyVerse = async (e) => {
    e.stopPropagation()
    
    let textToCopy = getTranslation(settings.language)
    
    if (settings.language !== 'ar') {
      const arabicText = getTranslation('ar')
      if (arabicText) {
        textToCopy += `\n\n${arabicText}`
      }
    }
    
    textToCopy += `\n\n— Quran ${verse.surah}:${verse.verse}`
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      // Show success indication
      const button = e.target.closest('.action-btn')
      const originalContent = button.innerHTML
      button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>'
      button.style.color = 'var(--success)'
      setTimeout(() => {
        button.innerHTML = originalContent
        button.style.color = ''
      }, 2000)
    } catch (error) {
      console.error('Failed to copy verse:', error)
    }
  }

  // Handle share verse
  const shareVerse = async (e) => {
    e.stopPropagation()
    
    const url = `${window.location.origin}/surah/${verse.surah}/verse/${verse.verse}`
    const title = `Quran ${verse.surah}:${verse.verse}`
    
    try {
      await navigator.share({ title, url })
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(url)
    }
  }

  // Intersection Observer for reading progress
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // TODO: Update reading progress
        }
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      id={`verse-${verse.verse}`}
      className={`verse-card ${isHighlighted ? 'highlighted' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      {/* Verse Number */}
      <div className="verse-number">
        <span className="verse-number-text">{verse.verse}</span>
      </div>

      {/* Primary Text */}
      {settings.language === 'ar' ? (
        <div className={`verse-arabic arabic-text size-${settings.fontSize}`}>
          {verse.text}
        </div>
      ) : (
        <div className={`verse-translation primary-translation ${
          settings.language === 'ur' ? 'urdu-text' : ''
        }`}>
          {getTranslation(settings.language)}
        </div>
      )}

      {/* Secondary Text */}
      {settings.language !== 'ar' && (
        <div className={`verse-arabic arabic-text size-${settings.fontSize}`} style={{marginTop: 'var(--space-4)', fontSize: '0.9em', opacity: '0.8'}}>
          {verse.text}
        </div>
      )}

      {/* Transliteration */}
      {settings.showTransliteration && (
        <div className="verse-transliteration">
          {/* TODO: Add transliteration data */}
          <em>Transliteration coming soon...</em>
        </div>
      )}

      {/* Actions */}
      <div className={`verse-actions ${showActions ? 'visible' : ''}`}>
        <button
          onClick={toggleAudio}
          className={`action-btn ${isPlaying ? 'active' : ''}`}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={toggleBookmark}
          className={`action-btn ${isBookmarked ? 'active' : ''}`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
        </button>

        <button
          onClick={copyVerse}
          className="action-btn"
          aria-label="Copy verse"
        >
          <Copy size={14} />
        </button>

        <button
          onClick={shareVerse}
          className="action-btn"
          aria-label="Share verse"
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Audio element (hidden) */}
      <audio ref={audioRef} preload="none" />
    </div>
  )
}

export default VerseCard