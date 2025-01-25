import { useState, useRef } from 'react'

export default function AudioPlayer({ surah, verse }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioUrl = `https://verses.quran.com/${surah}/${verse}.mp3`
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="audio-controls">
      <button onClick={togglePlay}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <audio 
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}
