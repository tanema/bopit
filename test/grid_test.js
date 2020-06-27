import test from 'tape'
import Grid from '../src/grid'

test('can create a grid', (t) => {
  const grid = new Grid(32)
  t.equal(grid.cellAt(1, 1), grid.rows[0][0])
  t.equal(grid.cellAt(30, 30), grid.rows[0][0])
  t.end()
})

test('can query a rectangle', (t) => {
  const grid = new Grid(32)
  t.equal(grid.cellsInRect(0, 0, 127, 127).length, 16)
  t.end()
})

test('can query a segment', (t) => {
  const grid = new Grid(32)
  t.equal(grid.getCellsTouchedBySegment(0, 0, 127, 127).length, 10)
  t.end()
})
