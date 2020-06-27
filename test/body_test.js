import test from 'tape'
import Body from '../src/body'
import World from '../src/world'

test('bodies can be added to cells', (t) => {
  const body = new Body(10, 10, 40, 40)
  const world = new World(20)
  body.add(world)
  t.equal(body.cells.length, 9)
  t.end()
})

test('it collieds with everything that it is supposed to collied with', (t) => {
  const world = new World(32)

  const body = new Body(0.099, 35.0986, 20, 20)
  body.add(world)

  const wall1 = new Body(-200, -200, 2542, 200, true)
  wall1.add(world)

  const wall2 = new Body(-200, 0, 200, 2342, true)
  wall2.add(world)

  const [x, y, cols] = body.move(-39.8994, -4.8998)
  t.equal(cols.length, 2)
  t.end()
})

test('bodies should not pass through with floating point errors', (t) => {
  const world = new World(32)
  const body = new Body(110.1, 110.10000000000002, 20, 20)
  body.add(world)
  const wall1 = new Body(100, 100, 400, 10, true)
  wall1.add(world)
  const wall2 = new Body(100, 100, 10, 400, true)
  wall2.add(world)

  const [x, y, cols] = body.move(100.1, 100.10000000000002)
  t.equal(cols.length, 2)
  t.end()
})

test('bodies should collied not moving', (t) => {
  const world = new World(64)
  const player = new Body(0, 1, 32, 32)
  const wall = new Body(0, 0, 32, 32, true)
  player.add(world)
  wall.add(world)

  const resp = player.move(player.x, player.y)
  t.deepEqual([0, 32,
    [{
      respType: 'slide',
      body: wall,
      distance: 1,
      move: {x: 0, y: 0},
      touch: {x: 0, y: 32},
      intersection: -992,
      normal: {x: 0, y: 1},
    }]
  ], resp)

  t.end()
});

test('bodies should collied multiple', (t) => {
  const world = new World(64)
  const player = new Body(0, 0, 32, 32)
  const topwall = new Body(-20, -20, 200, 20, true)
  const leftwall = new Body(-20, -20, 20, 200, true)

  player.add(world)
  topwall.add(world)
  leftwall.add(world)

  const resp = player.move(-5, -8)
  t.deepEqual(resp, [0.1, 0.1,
    [{
      respType: 'slide',
      body: topwall,
      distance: 4772,
      move: {x: -5, y: -8},
      intersection: -0,
      normal: {x: 0, y: 1},
      touch: {x: 0, y: 0.1},
    }, {
      respType: 'slide',
      body: leftwall,
      distance: 4772,
      move: {x: -5, y: 0.1},
      intersection: -0,
      normal: {x: 1, y: 0},
      touch: {x: 0.1, y: 0},
    }]
  ])

  t.end()
});
