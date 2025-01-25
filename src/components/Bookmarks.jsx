import { useState, useEffect } from 'react'

export default function Bookmarks({ onSelect }) {
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('quran-bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  const addBookmark = (surah, verse) => {
    const newBookmarks = [...bookmarks, { surah, verse }]
    setBookmarks(newBookmarks)
    localStorage.setItem('quran-bookmarks', JSON.stringify(newBookmarks))
  }

  return (
    <div className="bookmarks-panel">
      <h3>Bookmarks</h3>
      {bookmarks.map((b, i) => (
        <div 
          key={i} 
          className="bookmark-item"
          onClick={() => onSelect(b.surah, b.verse)}
        >
          Surah {b.surah}, Verse {b.verse}
        </div>
      ))}
    </div>
  )
}
