class World {
  constructor (cellSize) {
    this.responses = {
      touch: (b, c, gx, gy) => [c.touch.x, c.touch.y],
      cross: (b, c, gx, gy) => [gx, gy],
      slide: (b, c, gx, gy) => {
        if (c.normal.x !== 0) { gx = c.touch.x } else { gy = c.touch.y }
        return [gx, gy]
      },
      bounce: (b, c, gx, gy) => {
        let [bnx, bny] = [gx - c.touch.x, gy - c.touch.y]
        if (c.normal.x === 0) { bny = -bny } else { bnx = -bnx }
        return [c.touch.x + bnx, c.touch.y + bny]
      }
    }
    this.cellSize = cellSize || 64
    this.rows = {}
  }

  queryRect (x, y, w, h) {
    return this._getBodiesInCells(this._cellsInRect(x, y, w, h))
  }

  queryPoint (x, y) {
    return this._getBodiesInCells([this._getCell(...this._cellCoordsAt(x, y))])
  }

  querySegment (x1, y1, x2, y2) {
    const [cx1, cy1] = this._cellCoordsAt(x1, y1)
    const [cx2, cy2] = this._cellCoordsAt(x2, y2)
    let [stepX, dx, tx] = this._rayStep(cx1, x1, x2)
    let [stepY, dy, ty] = this._rayStep(cy1, y1, y2)
    let [cx, cy] = [cx1, cy1]

    const cells = [this._getCell(cx, cy)]

    for (;Math.abs(cx - cx2) + Math.abs(cy - cy2) > 1;) {
      if (tx < ty) {
        tx += dx
        cx += stepX
      } else {
        if (tx === ty) {
          cells.push(this._getCell(cx + stepX, cy))
        }
        ty += dy
        cy += stepY
      }
      cells.push(this._getCell(cx, cy))
    }

    if (cx !== cx2 || cy !== cy2) {
      cells.push(this._getCell(cx2, cy2))
    }

    return this._getBodiesInCells(cells)
      .map((b) => [b._getRayIntersectionFraction(x1, y1, x2 - x1, y2 - y1), b])
      .filter((selected) => selected[0] !== Infinity)
      .sort((a, b) => a[0] < b[0])
      .reduce((bodies, a) => bodies.push(a[1]) && bodies, [])
  }

  _getBodiesInCells (cells) {
    return [...new Set(cells.map((c) => [...c]).flat())]
  }

  _cellsInRect (x, y, w, h) {
    const [cl, ct, cr, cb] = [...this._cellCoordsAt(x, y), ...this._cellCoordsAt(x+w, y+h)]
    const cells = []
    for (let cx = cl; cx <= cr; cx++) {
      for (let cy = ct; cy <= cb; cy++) {
        cells.push(this._getCell(cx, cy))
      }
    }
    return cells
  }

  _getCell (cx, cy) {
    if (!this.rows[cx] || !this.rows[cx][cy]) {
      this.rows[cx] = this.rows[cx] || {}
      this.rows[cx][cy] = new Set()
    }
    return this.rows[cx][cy]
  }

  _cellCoordsAt (x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)]
  }

  _rayStep (ct, t1, t2) {
    const v = t2 - t1
    const delta = this.cellSize / v
    const n = t1 / this.cellSize
    if (v > 0) {
      return [1, delta, delta * (1.0 - Math.abs(n - Math.floor(n)))]
    } else if (v < 0) {
      return [-1, -delta, -delta * Math.abs(n - Math.floor(n))]
    } else {
      return [0, Infinity, Infinity]
    }
  }
}

export default World
