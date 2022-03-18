import React, { useRef, useEffect } from 'react'
import './App.css'
import { useGetGameStateQuery } from './store/game/game-api'
import { draw, initCanvas } from './services/drawer'
import Header from './components/Header/Header'
import OfflinePlaceholder from './components/OfflinePlaceholder/OfflinePlaceholder'
import initKeysListening from './services/keys-listening'
import { createProton } from './services/dragon'
import GameState from './enums/game-state'

function App() {
  const canvasRef = useRef(null)
  const dragonCanvasRef = useRef(null)
  const { data, isLoading } = useGetGameStateQuery('')

  useEffect(() => {
    if (canvasRef.current && dragonCanvasRef.current) {
      initCanvas(canvasRef.current)
      initCanvas(dragonCanvasRef.current)
      createProton(dragonCanvasRef.current)
      initKeysListening()
    }
  }, [canvasRef, isLoading])

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, data)
    }
  }, [canvasRef, data])

  if (isLoading) return <div className="loading-app">Loading...</div>
  if (!data) return <OfflinePlaceholder />

  return (
    <div className="app">
      <Header />
      <div className="canvas-container">
        <div className="position-relative">
          <canvas id="game" ref={canvasRef}></canvas>
          <canvas
            id="dragon"
            className={data.state !== GameState.PLAY ? 'display-none' : ''}
            ref={dragonCanvasRef}
          ></canvas>
        </div>
      </div>
    </div>
  )
}

export default App
