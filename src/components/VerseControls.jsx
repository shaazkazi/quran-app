export function VerseControls({ 
  verseNumber, 
  onVerseChange,
  selectedLanguage,
  onLanguageChange,
  selectedTranslator,
  onTranslatorChange 
}) {
  const translators = {
    en: ['Sahih International', 'Pickthall', 'Yusuf Ali'],
    ur: ['Maududi', 'Ahmed Ali']
  }

  return (
    <div className="verse-controls">
      <div className="controls-group">
        <input
          type="number"
          value={verseNumber}
          onChange={(e) => onVerseChange(e.target.value)}
          placeholder="Verse"
          className="verse-input"
        />
        
        {selectedLanguage !== 'ar' && (
          <select
            value={selectedTranslator}
            onChange={(e) => onTranslatorChange(e.target.value)}
            className="translator-select"
          >
            {translators[selectedLanguage]?.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}