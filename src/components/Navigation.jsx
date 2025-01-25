import { theme } from '../theme'

export function Navigation({ 
  language, 
  translator,
  onLanguageChange,
  onTranslatorChange,
  translators,
  onMenuToggle 
}) {
  return (
    <header className="nav-header">
      <button className="mobile-menu" onClick={onMenuToggle}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className="nav-controls">
        <div className="translation-group">
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="ar">Arabic</option>
            <option value="en">English</option>
            <option value="ur">Urdu</option>
          </select>

          {language !== 'ar' && (
            <select
              value={translator}
              onChange={(e) => onTranslatorChange(e.target.value)}
            >
              {translators[language]?.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </header>
  )
}