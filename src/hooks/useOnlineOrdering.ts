"use client"

import { useState, useEffect } from 'react'

export const useOnlineOrdering = () => {
  const [isOnlineOrderingEnabled, setIsOnlineOrderingEnabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load saved state from localStorage
    const saved = localStorage.getItem('kona-online-ordering-enabled')
    if (saved !== null) {
      setIsOnlineOrderingEnabled(saved === 'true')
    }
    setIsLoaded(true)
  }, [])

  const toggleOnlineOrdering = () => {
    const newState = !isOnlineOrderingEnabled
    setIsOnlineOrderingEnabled(newState)
    localStorage.setItem('kona-online-ordering-enabled', newState.toString())
  }

  return {
    isOnlineOrderingEnabled,
    toggleOnlineOrdering,
    isLoaded
  }
}