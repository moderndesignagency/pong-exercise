import Proton from 'proton-engine'
import dot from '../assets/dot'

const dragon = {
  emitter: null,
  proton: null,
  conf: { radius: 10 },
}

export function createProton(canvas) {
  const proton = new Proton()
  const emitter = createImageEmitter({
    canvas,
    x: canvas.width / 2 + dragon.conf.radius,
    y: canvas.height / 2,
    startColor: '#4F1500',
    endColor: '#FF29FF',
  })
  proton.addEmitter(emitter)

  const renderer = new Proton.WebGlRenderer(canvas)
  renderer.blendFunc('SRC_ALPHA', 'ONE')
  proton.addRenderer(renderer)
  dragon.emitter = emitter
  dragon.proton = proton
}

function createImageEmitter({ canvas, x, y, startColor, endColor }) {
  const emitter = new Proton.Emitter()
  emitter.rate = new Proton.Rate(new Proton.Span(5, 7), new Proton.Span(0.01, 0.02))

  emitter.addInitialize(new Proton.Mass(1))
  emitter.addInitialize(new Proton.Life(0.6))
  emitter.addInitialize(new Proton.Body([dot], 36))
  emitter.addInitialize(new Proton.Radius(10))

  emitter.addBehaviour(new Proton.Alpha(1, 0))
  emitter.addBehaviour(new Proton.Color(startColor, endColor))
  emitter.addBehaviour(new Proton.Scale(2))
  emitter.addBehaviour(
    new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'dead')
  )
  emitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-8, 9), 'add'))
  emitter.addBehaviour(new Proton.RandomDrift(3, 3, 0.03))

  emitter.p.x = x
  emitter.p.y = y
  emitter.emit()

  return emitter
}

function emitterMove(emitter, ball) {
  emitter.p.set(ball.cx, ball.cy)
  window.emitter = emitter
}

export function renderProton(ball) {
  emitterMove(dragon.emitter, ball)
  dragon.proton.update()
}
