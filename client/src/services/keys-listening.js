import websocket from '../store/game/ws-client'

/**
 * Mapping of keys to lightweight recognizable on server
 */
const keysMap = {
  arrowup: 'up',
  arrowdown: 'down',
  ' ': 'space',
  w: 'w',
  s: 's',
}

export default function initKeysListening() {
  /**
   * Timers ids to handle keys long press
   */
  const keysPressed = {
    up: false,
    down: false,
    space: false,
    w: false,
    s: false,
  }

  const sendKeyToServer = key => {
    if (keysPressed[key]) {
      websocket.send(key)
      setTimeout(() => sendKeyToServer(key), 100)
    }
  }

  const handleKeyDown = e => {
    const key = keysMap[e.key.toLowerCase()]
    if (key) {
      keysPressed[key] = true
      sendKeyToServer(key)
    }
  }

  const handleKeyUp = e => {
    const key = keysMap[e.key.toLowerCase()]
    if (key) {
      keysPressed[key] = false
    }
  }

  document.onkeydown = handleKeyDown
  document.onkeyup = handleKeyUp
}
