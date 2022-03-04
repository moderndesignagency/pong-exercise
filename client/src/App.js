import React, { useRef, useEffect } from 'react'
import './App.css'
import { useGetGameStateQuery } from './store/game'
import { draw, setupCanvas } from './drawer'
import Header from './components/Header/Header'

function App() {
  const canvasRef = useRef(null)
  const { data, isLoading } = useGetGameStateQuery('')

  useEffect(() => {
    if (!isLoading && canvasRef.current) {
      setupCanvas(canvasRef.current)
    }
  }, [canvasRef, isLoading])

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, data)
    }
  }, [canvasRef, data])

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Missing data</div>

  return (
    <div className="App">
      <Header />
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default App
