import React, { useRef, useEffect } from 'react'
import './App.css'
import { useGetGameStateQuery } from './store/game/game-api'
import { draw, setupCanvas } from './services/drawer'
import Header from './components/Header/Header'
import OfflinePlaceholder from './components/OfflinePlaceholder/OfflinePlaceholder'
import initKeysListening from './services/keys-listening';

function App() {
  const canvasRef = useRef(null)
  const { data, isLoading } = useGetGameStateQuery('')

  useEffect(() => {
    if (!isLoading && canvasRef.current) {
      setupCanvas(canvasRef.current)
      initKeysListening()
    }
  }, [canvasRef, isLoading])

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, data)
    }
  }, [canvasRef, data])

  if (isLoading) return <div className='loading-app'>Loading...</div>
  if (!data) return <OfflinePlaceholder />

  return (
    <div className="app">
      <Header />
      <div className='canvas-container'>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default App
