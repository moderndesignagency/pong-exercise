import confetti from 'canvas-confetti'

const animationState = {
  running: false,
  end: null,
  winSound: new Audio('/assets/audio/win.mp3'),
}

export function startConfetti() {
  animationState.end = Date.now() + 5 * 1000

  if (!animationState.running) {
    animate()
    animationState.winSound.play()
  }
}

function animate() {
  confetti({
    particleCount: 3,
    angle: 60,
    spread: 60,
    origin: { x: 0 },
  })
  confetti({
    particleCount: 3,
    angle: 120,
    spread: 60,
    origin: { x: 1 },
  })

  if (Date.now() < animationState.end) {
    animationState.running = true
    requestAnimationFrame(() => animate())
  } else {
    animationState.running = false
  }
}

export function stopConfetti() {
  if (!animationState.running) return
  animationState.end = Date.now()
  animationState.running = false
  setTimeout(confetti.reset, 200)
}
