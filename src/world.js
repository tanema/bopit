import { touchFilter, crossFilter, slideFilter, bounceFilter } from './filters'
import Grid from './grid'

const min = Math.min,
      max = Math.max

class World {
  constructor(cellSize) {
    this.responses = {
      'touch': touchFilter,
      'cross': crossFilter,
      'slide': slideFilter,
      'bounce': bounceFilter,
    }
    this.grid = new Grid(cellSize)
  }

  queryRect(x, y, w, h) {
    return this.getBodiesInCells(this.grid.cellsInRect(x, y, w, h))
  }

  queryPoint(x, y) {
    return this.getBodiesInCells([this.grid.cellAt(x, y)])
  }

  querySegment(x1, y1, x2, y2) {
    return this.getBodiesInCells(this.grid.getCellsTouchedBySegment(x1, y1, x2, y2))
      .map((b) => [b._getRayIntersectionFraction(x1, y1, x2-x1, y2-y1), b])
      .filter((selected) => selected[0] != Infinity)
      .sort((a, b) => a[0] < b[0])
      .reduce((bodies, a) => { bodies.push(a[1]) && bodies }, [])
  }

  getBodiesInCells(cells) {
    return [...new Set(cells.map((c) => [...c]).flat())]
  }

  project(body, goalX, goalY, filter) {
    return this.queryRect(...this._projectRect(body, goalX, goalY))
      .map((other) => body.collide(other, goalX, goalY, filter))
      .filter((collision) => !!collision)
      .sort((a, b) =>  a.distance < b.distance)
  }

  _projectRect(body, goalX, goalY) {
    const x = min(goalX, body.x)
    const y = min(goalY, body.y)
    return [x, y, max(goalX+body.w, body.x+body.w) - x, max(goalY+body.h, body.y+body.h) - y]
  }
}

export default World
