"use client"

import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'kona-online-ordering-enabled'

// Same-tab subscribers. The `storage` event only fires in *other* tabs, so
// toggling notifies this set directly to keep the current tab in sync.
const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

// Only ever invoked on the client, after subscribe() has run.
function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY)
}

// The server has no localStorage. React also uses this snapshot for the
// hydration render, so server and client initial markup match exactly.
function getServerSnapshot(): string | null {
  return null
}

// Render-pure "have we hydrated yet" signal: no state, no effect, no setState.
const subscribeToNothing = () => () => {}
const mountedOnClient = () => true
const notMountedOnServer = () => false

export const useOnlineOrdering = () => {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isLoaded = useSyncExternalStore(
    subscribeToNothing,
    mountedOnClient,
    notMountedOnServer
  )

  // Absent key means "enabled", matching the previous default.
  const isOnlineOrderingEnabled = stored === null ? true : stored === 'true'

  const toggleOnlineOrdering = useCallback(() => {
    const next = !(localStorage.getItem(STORAGE_KEY) === null
      ? true
      : localStorage.getItem(STORAGE_KEY) === 'true')
    localStorage.setItem(STORAGE_KEY, next.toString())
    // Notify this tab; other tabs receive the native `storage` event.
    listeners.forEach((listener) => listener())
  }, [])

  return {
    isOnlineOrderingEnabled,
    toggleOnlineOrdering,
    isLoaded,
  }
}
