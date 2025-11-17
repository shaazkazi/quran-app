import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Search, Star, BookOpen, Heart } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const Sidebar = ({ isOpen, onClose, settings }) => {
  const navigate = useNavigate()
  const { surahId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [surahNames, setSurahNames] = useState([])
  const [bookmarks, setBookmarks] = useLocalStorage('quran-bookmarks', [])
  const [favorites, setFavorites] = useLocalStorage('quran-favorites', [])

  // Load surah names
  useEffect(() => {
    const loadSurahNames = async () => {
      try {
        const surahData = await import('../json/surah.name.json')
        setSurahNames(surahData.default.surahs)
      } catch (error) {
        console.error('Failed to load surah names:', error)
      }
    }
    loadSurahNames()
  }, [])

  // Filter surahs based on search and active tab
  const filteredSurahs = useMemo(() => {
    let filtered = surahNames

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(surah =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
      )
    }

    // Filter by tab
    switch (activeTab) {
      case 'bookmarks':
        filtered = filtered.filter(surah => bookmarks.includes(surah.number))
        break
      case 'favorites':
        filtered = filtered.filter(surah => favorites.includes(surah.number))
        break
      case 'recent':
        // TODO: Implement recent surahs
        break
      default:
        break
    }

    return filtered
  }, [surahNames, searchTerm, activeTab, bookmarks, favorites])

  const handleSurahClick = (surahNumber) => {
    navigate(`/surah/${surahNumber}`)
    if (window.innerWidth <= 768) {
      onClose()
    }
  }

  const toggleBookmark = (surahNumber, e) => {
    e.stopPropagation()
    setBookmarks(prev => 
      prev.includes(surahNumber)
        ? prev.filter(id => id !== surahNumber)
        : [...prev, surahNumber]
    )
  }

  const toggleFavorite = (surahNumber, e) => {
    e.stopPropagation()
    setFavorites(prev => 
      prev.includes(surahNumber)
        ? prev.filter(id => id !== surahNumber)
        : [...prev, surahNumber]
    )
  }

  const tabs = [
    { id: 'all', label: 'All Surahs', icon: BookOpen },
    { id: 'bookmarks', label: 'Bookmarks', icon: Star },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ]

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Surahs</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search surahs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span className="tab-label">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Surah List */}
        <div className="sidebar-content">
          {filteredSurahs.length === 0 ? (
            <div className="empty-state">
              <p>No surahs found</p>
            </div>
          ) : (
            <div className="surah-list">
              {filteredSurahs.map(surah => (
                <div
                  key={surah.number}
                  className={`surah-item ${
                    surahId === surah.number.toString() ? 'active' : ''
                  }`}
                  onClick={() => handleSurahClick(surah.number)}
                >
                  <div className="sidebar-surah-number">
                    {surah.number}
                  </div>
                  
                  <div className="surah-info">
                    <h3 className="surah-name">{surah.name}</h3>
                    <p className="surah-translation">{surah.translation}</p>
                  </div>

                  <div className="surah-actions">
                    <button
                      onClick={(e) => toggleFavorite(surah.number, e)}
                      className={`action-btn ${
                        favorites.includes(surah.number) ? 'active' : ''
                      }`}
                      aria-label="Toggle favorite"
                    >
                      <Heart size={14} />
                    </button>
                    
                    <button
                      onClick={(e) => toggleBookmark(surah.number, e)}
                      className={`action-btn ${
                        bookmarks.includes(surah.number) ? 'active' : ''
                      }`}
                      aria-label="Toggle bookmark"
                    >
                      <Star size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="sidebar-footer">
          <div className="quick-stats">
            <div className="stat">
              <span className="stat-value">{bookmarks.length}</span>
              <span className="stat-label">Bookmarks</span>
            </div>
            <div className="stat">
              <span className="stat-value">{favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar