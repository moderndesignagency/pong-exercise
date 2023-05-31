import React from 'react'
import './App.css'
import { useGetGameStateQuery } from './store/game/game-api'
import OfflinePlaceholder from './components/OfflinePlaceholder/OfflinePlaceholder'
import Header from './components/Header/Header'
import GameCanvas from './components/GameCanvas/GameCanvas'

function App() {
  const { data, isLoading } = useGetGameStateQuery('')

  if (isLoading) return <div className="loading-app">Loading...</div>
  if (!data) return <OfflinePlaceholder />

  return (
    <div className="app">
      <Header />
      <GameCanvas />
    </div>
  )
}

export default App
