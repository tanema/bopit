import { World, Body } from 'bopit'
import Keyboard from './keyboard'

const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const world = new World(32)
const body = new Body(120, 120, 20, 20)
body.add(world)
const wall1 = new Body(100, 100, 400, 10)
wall1.add(world)
const wall2 = new Body(100, 100, 10, 400)
wall2.add(world)

const bodies = [body, wall1, wall2]

const drawBody = (body) => {
  ctx.beginPath()
  ctx.fillStyle = 'red'
  ctx.fillRect(body.x, body.y, body.w, body.h)
  ctx.stroke()
}

let vx = 0
let vy = 0
const vel = 10
const updateVelocity = () => {
  if (Keyboard.isDown('ArrowLeft')) {
    vx = -vel
  } else if (Keyboard.isDown('ArrowRight')) {
    vx = vel
  } else {
    vx = 0
  }
  if (Keyboard.isDown('ArrowUp')) {
    vy = -vel
  } else if (Keyboard.isDown('ArrowDown')) {
    vy = vel
  } else {
    vy = 0
  }
  return [vx, vy]
}

function render () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const [vx, vy] = updateVelocity()
  if (vx !== 0 || vy !== 0) {
    body.move(body.x + vx, body.y + vy)
  }
  bodies.forEach((b) => drawBody(b))
  requestAnimationFrame(render)
}
render()
