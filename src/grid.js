class Cell extends Set {
  constructor(x, y) {
    super()
    this.x = x
    this.y = y
  }
}

class Grid {
  constructor(cellSize) {
    this.rows = {}
    this.cellSize = cellSize
    this.elements = {}
  }

  cellAt(x, y) {
    return this._getCell(...this._cellCoordsAt(x, y))
  }

  cellsInRect(x, y, w, h) {
    const [cl, ct, cr, cb] = [...this._cellCoordsAt(x, y), ...this._cellCoordsAt(x+w, y+h)]
    const cells = []
    for (let cx = cl; cx <= cr; cx++) {
      for (let cy = ct; cy <= cb; cy++) {
        cells.push(this._getCell(cx, cy))
      }
    }
    return cells
  }

  getCellsTouchedBySegment(x1, y1, x2, y2) {
    let [cx1, cy1] = this._cellCoordsAt(x1, y1)
    let [cx2, cy2] = this._cellCoordsAt(x2, y2)
    let [stepX, dx, tx] = this._rayStep(cx1, x1, x2)
    let [stepY, dy, ty] = this._rayStep(cy1, y1, y2)
    let [cx, cy] = [cx1, cy1]

    const cells = [this._getCell(cx, cy)]

    for(;Math.abs(cx-cx2)+Math.abs(cy-cy2) > 1;) {
      if (tx < ty) {
        tx += dx
        cx += stepX
      } else {
        if (tx == ty) {
          cells.push(this._getCell(cx+stepX, cy))
        }
        ty += dy
        cy += stepY
      }
      cells.push(this._getCell(cx, cy))
    }

    if(cx != cx2 || cy != cy2) {
      cells.push(this._getCell(cx2, cy2))
    }

    return cells
  }

  _getCell(cx, cy) {
    if (!this.rows[cx] || !this.rows[cx][cy]) {
      this.rows[cx] = this.rows[cx] || {}
      this.rows[cx][cy] = new Cell(cx, cy)
    }
    return this.rows[cx][cy]
  }

  _cellCoordsAt(x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)]
  }

  _rayStep(ct, t1, t2) {
    const v = t2 - t1
    const delta = this.cellSize / v
    const n = t1/this.cellSize
    if (v > 0) {
      return [1, delta, delta * (1.0 - Math.abs(n - Math.floor(n)))]
    } else if (v < 0) {
      return [-1, -delta, -delta * Math.abs(n - Math.floor(n))]
    } else {
      return [0, Infinity, Infinity]
    }
  }
}

export default Grid
