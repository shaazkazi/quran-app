import { createContext, useContext, useReducer, useEffect } from 'react'

const QuranContext = createContext()

const initialState = {
  currentSurah: 1,
  currentVerse: null,
  bookmarks: [],
  favorites: [],
  readingHistory: [],
  searchHistory: [],
  isLoading: false,
  error: null
}

const quranReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SURAH':
      return { ...state, currentSurah: action.payload }
    
    case 'SET_CURRENT_VERSE':
      return { ...state, currentVerse: action.payload }
    
    case 'ADD_BOOKMARK':
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload]
      }
    
    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(bookmark => bookmark !== action.payload)
      }
    
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      }
    
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(favorite => favorite !== action.payload)
      }
    
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        readingHistory: [
          action.payload,
          ...state.readingHistory.filter(item => 
            !(item.surah === action.payload.surah && item.verse === action.payload.verse)
          )
        ].slice(0, 50) // Keep only last 50 items
      }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    default:
      return state
  }
}

export const QuranProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quranReducer, initialState)

  // Load persisted data on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('quran-bookmarks')
      const savedFavorites = localStorage.getItem('quran-favorites')
      const savedHistory = localStorage.getItem('quran-history')

      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks)
        bookmarks.forEach(bookmark => {
          dispatch({ type: 'ADD_BOOKMARK', payload: bookmark })
        })
      }

      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites)
        favorites.forEach(favorite => {
          dispatch({ type: 'ADD_FAVORITE', payload: favorite })
        })
      }

      if (savedHistory) {
        const history = JSON.parse(savedHistory)
        history.forEach(item => {
          dispatch({ type: 'ADD_TO_HISTORY', payload: item })
        })
      }
    } catch (error) {
      console.error('Failed to load persisted data:', error)
    }
  }, [])

  // Persist data when state changes
  useEffect(() => {
    localStorage.setItem('quran-bookmarks', JSON.stringify(state.bookmarks))
  }, [state.bookmarks])

  useEffect(() => {
    localStorage.setItem('quran-favorites', JSON.stringify(state.favorites))
  }, [state.favorites])

  useEffect(() => {
    localStorage.setItem('quran-history', JSON.stringify(state.readingHistory))
  }, [state.readingHistory])

  const value = {
    ...state,
    dispatch,
    // Helper functions
    setCurrentSurah: (surah) => dispatch({ type: 'SET_CURRENT_SURAH', payload: surah }),
    setCurrentVerse: (verse) => dispatch({ type: 'SET_CURRENT_VERSE', payload: verse }),
    addBookmark: (bookmark) => dispatch({ type: 'ADD_BOOKMARK', payload: bookmark }),
    removeBookmark: (bookmark) => dispatch({ type: 'REMOVE_BOOKMARK', payload: bookmark }),
    addFavorite: (favorite) => dispatch({ type: 'ADD_FAVORITE', payload: favorite }),
    removeFavorite: (favorite) => dispatch({ type: 'REMOVE_FAVORITE', payload: favorite }),
    addToHistory: (item) => dispatch({ type: 'ADD_TO_HISTORY', payload: item }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <QuranContext.Provider value={value}>
      {children}
    </QuranContext.Provider>
  )
}

export const useQuran = () => {
  const context = useContext(QuranContext)
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider')
  }
  return context
}