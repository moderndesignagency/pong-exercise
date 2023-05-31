import React, { useEffect, useRef } from 'react'
import { useGetGameStateQuery } from '../../store/game/game-api'
import { draw } from '../../services/drawer'
import { createProton } from '../../services/dragon'
import initKeysListening from '../../services/keys-listening'
import { GameEvolutionState } from '../../enums/game-state'
import useElementSize from '../../hooks/useElementSize'

const CANVAS_TOP_BOTTOM_BORDER_WIDTH = 8

const GameCanvas = (): JSX.Element => {
  const canvasRef = useRef(null)
  const dragonCanvasRef = useRef(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useGetGameStateQuery('')
  const containerSize = useElementSize(canvasContainerRef)

  useEffect(() => {
    if (dragonCanvasRef.current) {
      createProton(dragonCanvasRef.current)
      initKeysListening()
    }
  }, [isLoading])

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, data)
    }
  }, [data])

  if (!data) {
    return <div />
  }

  const canvasSize = {
    width: data.screen.width,
    height: data.screen.height + 2 * CANVAS_TOP_BOTTOM_BORDER_WIDTH,
  }
  const scaleFactor = Math.min(
    (containerSize.width ?? canvasSize.width) / canvasSize.width,
    (containerSize.height ?? canvasSize.height) / canvasSize.height
  )
  const finalSize = {
    width: scaleFactor * canvasSize.width,
    height: scaleFactor * canvasSize.height,
  }

  return (
    <div className="canvas-container" ref={canvasContainerRef}>
      <div className="position-relative" style={{ ...finalSize }}>
        <canvas
          id="game"
          width={data.screen.width}
          height={data.screen.height}
          ref={canvasRef}
          style={{ transform: `scale(${scaleFactor})` }}
        />
        <canvas
          id="dragon"
          className={data.state !== GameEvolutionState.PLAY ? 'display-none' : ''}
          width={data.screen.width}
          height={data.screen.height}
          ref={dragonCanvasRef}
          style={{ transform: `scale(${scaleFactor})` }}
        />
      </div>
    </div>
  )
}
export default GameCanvas
