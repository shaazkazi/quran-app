import { useState, useEffect, useRef } from 'react'
import { Search, X, Book, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchModal = ({ isOpen, onClose, settings }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchQuran = async () => {
      setIsLoading(true)
      try {
        // Load search data
        const [arabicData, englishData, urduData, surahData] = await Promise.all([
          import('../json/arabic.json'),
          import('../json/en.sahih.json'),
          import('../json/ur.maududi.json'),
          import('../json/surah.name.json')
        ])

        const searchResults = []
        const searchTerm = query.toLowerCase()

        // Search in Arabic text
        arabicData.default.forEach(verse => {
          if (verse.text.includes(query)) {
            searchResults.push({
              type: 'verse',
              surah: verse.surah,
              verse: verse.verse,
              text: verse.text,
              language: 'ar',
              highlight: verse.text
            })
          }
        })

        // Search in English translation
        englishData.default.forEach(verse => {
          if (verse.text.toLowerCase().includes(searchTerm)) {
            searchResults.push({
              type: 'verse',
              surah: verse.surah,
              verse: verse.verse,
              text: verse.text,
              language: 'en',
              highlight: verse.text
            })
          }
        })

        // Search in Urdu translation
        urduData.default.forEach(verse => {
          if (verse.text.toLowerCase().includes(searchTerm)) {
            searchResults.push({
              type: 'verse',
              surah: verse.surah,
              verse: verse.verse,
              text: verse.text,
              language: 'ur',
              highlight: verse.text
            })
          }
        })

        // Search in surah names
        surahData.default.surahs.forEach(surah => {
          if (
            surah.name.toLowerCase().includes(searchTerm) ||
            surah.translation.toLowerCase().includes(searchTerm) ||
            surah.number.toString().includes(query)
          ) {
            searchResults.push({
              type: 'surah',
              surah: surah.number,
              name: surah.name,
              translation: surah.translation,
              highlight: `${surah.name} - ${surah.translation}`
            })
          }
        })

        // Remove duplicates and limit results
        const uniqueResults = searchResults
          .filter((result, index, self) => 
            index === self.findIndex(r => 
              r.type === result.type && 
              r.surah === result.surah && 
              (result.type === 'surah' || r.verse === result.verse)
            )
          )
          .slice(0, 20)

        setResults(uniqueResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchQuran, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleResultClick = (result) => {
    if (result.type === 'surah') {
      navigate(`/surah/${result.surah}`)
    } else {
      navigate(`/surah/${result.surah}/verse/${result.verse}`)
    }
    onClose()
  }

  const highlightText = (text, query) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    )
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Quran..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="loading-spinner small"></div>
              <p>Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="results-list">
              {results.map((result, index) => (
                <div
                  key={`${result.type}-${result.surah}-${result.verse || ''}`}
                  className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-icon">
                    <Book size={16} />
                  </div>
                  
                  <div className="result-content">
                    <div className="result-meta">
                      {result.type === 'surah' ? (
                        <span>Surah {result.surah}</span>
                      ) : (
                        <span>Surah {result.surah}, Verse {result.verse}</span>
                      )}
                    </div>
                    
                    <div className={`result-text ${
                      result.language === 'ar' ? 'arabic-text' : 
                      result.language === 'ur' ? 'urdu-text' : ''
                    }`}>
                      {result.type === 'surah' ? (
                        <span>{result.name} - {result.translation}</span>
                      ) : (
                        highlightText(result.text.substring(0, 150) + '...', query)
                      )}
                    </div>
                  </div>
                  
                  <ArrowRight size={16} className="result-arrow" />
                </div>
              ))}
            </div>
          ) : query && !isLoading ? (
            <div className="no-results">
              <p>No results found for "{query}"</p>
              <p className="text-secondary">Try different keywords or check spelling</p>
            </div>
          ) : (
            <div className="search-suggestions">
              <h3>Popular Searches</h3>
              <div className="suggestions-list">
                {['Al-Fatiha', 'Ayat al-Kursi', 'Rahman', 'Yasin', 'Mulk'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="search-footer">
          <div className="search-shortcuts">
            <kbd>↑↓</kbd> Navigate
            <kbd>Enter</kbd> Select
            <kbd>Esc</kbd> Close
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal