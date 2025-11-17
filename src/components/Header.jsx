import { useState } from 'react'
import { Search, Settings, Menu, Moon, Sun, Volume2 } from 'lucide-react'

const Header = ({ 
  onMenuClick, 
  onSearchClick, 
  onSettingsClick, 
  settings, 
  onSettingsChange 
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const toggleTheme = () => {
    onSettingsChange({ 
      theme: settings.theme === 'dark' ? 'light' : 'dark' 
    })
  }

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying)
    // Audio functionality will be implemented later
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          <button
            onClick={onMenuClick}
            className="header-menu-btn"
            aria-label="Toggle sidebar"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={20} />
          </button>
          
          <div className="header-logo">
            <img 
              src="/quranlogo.png" 
              alt="Quran App" 
              className="logo-image"
            />
            <span className="logo-text">Quran</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <button
            onClick={onSearchClick}
            className="search-trigger"
            aria-label="Search Quran"
          >
            <Search size={18} />
            <span>Search Quran...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>
        </div>

        {/* Right Section */}
        <div className="header-right">
          <button
            onClick={toggleAudio}
            className={`btn btn-ghost btn-sm ${isAudioPlaying ? 'active' : ''}`}
            aria-label="Toggle audio"
          >
            <Volume2 size={18} />
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onSettingsClick}
            className="btn btn-ghost btn-sm"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header