export function Sidebar({ selectedSurah, onSurahSelect }) {
  return (
    <aside className="sidebar">
      <div className="surah-list">
        {[...Array(114)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`surah-item ${selectedSurah === (idx + 1).toString() ? 'active' : ''}`}
            onClick={() => onSurahSelect((idx + 1).toString())}
          >
            <div className="surah-number">{idx + 1}</div>
            <div className="surah-info">
              <span className="surah-name">Surah {idx + 1}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
