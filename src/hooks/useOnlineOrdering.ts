"use client"

import { useCallback, useState, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'kona-online-ordering-enabled'

const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY)
}

// Not readable during SSR; hydration reconciles it to the stored value.
function getServerSnapshot(): string | null {
  return null
}

export const useOnlineOrdering = () => {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [hydrated, setHydrated] = useState(false)

  // Mirrors the previous `isLoaded` flag without a synchronous setState in an effect.
  if (typeof window !== 'undefined' && !hydrated) {
    setHydrated(true)
  }

  const isOnlineOrderingEnabled = stored === null ? true : stored === 'true'

  const toggleOnlineOrdering = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, (!isOnlineOrderingEnabled).toString())
    listeners.forEach((listener) => listener())
  }, [isOnlineOrderingEnabled])

  return {
    isOnlineOrderingEnabled,
    toggleOnlineOrdering,
    isLoaded: hydrated,
  }
}
