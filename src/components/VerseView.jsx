export function VerseView({ verses, selectedLanguage, translations, favorites, onFavoriteToggle }) {
  const getTranslation = (surah, verse, lang) => {
    return translations[lang]?.find(
      t => t.surah === surah && t.verse === verse
    )?.text || ''
  }

  return (
    <main className="verse-view">
      <div className="verses-container">
        {verses.map(verse => (
          <div 
            key={`${verse.surah}-${verse.verse}`}
            className="verse-card"
          >
            <div className="verse-header">
              <span className="verse-number">{verse.verse}</span>
              <button 
                className="favorite-btn"
                onClick={() => onFavoriteToggle(verse.surah, verse.verse)}
              >
                {favorites.includes(`${verse.surah}-${verse.verse}`) ? '★' : '☆'}
              </button>
            </div>
            
            <div className="verse-text" dir="rtl">
              {verse.text}
            </div>
            
            {selectedLanguage !== 'ar' && (
              <div 
                className={`verse-translation ${selectedLanguage}`}
                dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}
              >
                {getTranslation(verse.surah, verse.verse, selectedLanguage)}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
