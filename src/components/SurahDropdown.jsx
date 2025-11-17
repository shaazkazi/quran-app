import { useState, useEffect } from 'react'

const SurahDropdown = ({ value, onChange, className = "" }) => {
  const [surahs, setSurahs] = useState([])

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahData = await import('../json/surah.name.json')
        const surahList = surahData.default.surahs.map(surah => ({
          value: surah.number.toString(),
          name: `${surah.number}. ${surah.name}`
        }))
        setSurahs(surahList)
      } catch (error) {
        console.error('Failed to load surah names:', error)
      }
    }
    loadSurahs()
  }, [])

  return (
    <select 
      value={value} 
      onChange={onChange} 
      className={`surah-select ${className}`}
    >
      {surahs.map(surah => (
        <option key={surah.value} value={surah.value}>
          {surah.name}
        </option>
      ))}
    </select>
  )
}

export default SurahDropdown