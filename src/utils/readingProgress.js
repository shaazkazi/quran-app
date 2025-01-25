export const saveReadingProgress = (surahNumber, verseNumber, scrollPosition) => {
  const progress = JSON.parse(localStorage.getItem('quran-reading-progress') || '{}')
  progress[surahNumber] = {
    lastReadVerse: verseNumber,
    scrollPosition
  }
  localStorage.setItem('quran-reading-progress', JSON.stringify(progress))
}

export const getReadingProgress = (surahNumber) => {
  const progress = JSON.parse(localStorage.getItem('quran-reading-progress') || '{}')
  return progress[surahNumber] || null
}
