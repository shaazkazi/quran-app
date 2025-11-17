import { useEffect, useState } from 'react'
import { BookOpen, Clock, Target } from 'lucide-react'

const ReadingProgress = ({ currentSurah, totalVerses, progress, onProgressUpdate }) => {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      
      setCurrentProgress(Math.min(Math.max(scrollPercent, 0), 100))
      
      // Update progress in parent
      onProgressUpdate(prev => ({
        ...prev,
        [currentSurah]: {
          progress: scrollPercent,
          lastRead: Date.now(),
          timeSpent: Date.now() - startTime
        }
      }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentSurah, onProgressUpdate, startTime])

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // Reset timer when surah changes
  useEffect(() => {
    setStartTime(Date.now())
    setTimeSpent(0)
  }, [currentSurah])

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const surahProgress = progress[currentSurah]?.progress || 0

  return (
    <div className="reading-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      
      <div className="progress-stats">
        <div className="stat">
          <BookOpen size={14} />
          <span>{Math.round(currentProgress)}% complete</span>
        </div>
        
        <div className="stat">
          <Clock size={14} />
          <span>{formatTime(timeSpent)}</span>
        </div>
        
        <div className="stat">
          <Target size={14} />
          <span>{totalVerses} verses</span>
        </div>
      </div>
    </div>
  )
}

export default ReadingProgress