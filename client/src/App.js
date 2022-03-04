import React, { useRef, useEffect } from 'react'
import './App.css'
import { useGetGameStateQuery } from './store/game'
import {draw, setupCanvas} from './drawer'

function App() {
  const canvasRef = useRef(null)
  const {
    data,
    isLoading
  } = useGetGameStateQuery('', {
    pollingInterval: 20,
    skip: false,
  })

  useEffect(() => {
    console.log('Loading terminated')
    setupCanvas(canvasRef.current)
  }, [canvasRef, isLoading])

  useEffect(() => {
    draw(canvasRef.current, data)
  }, [canvasRef, data])

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Missing data</div>

  return (
    <div className="App">
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default App
