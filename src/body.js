const min = Math.min,
  sign = Math.sign,
  abs = Math.abs,
  nearest = (x, a, b) => (abs(a-x) < abs(b-x)) ? a : b,
  defaultResp = 'slide',
  testNormals = [[-1, 0], [0, 1], [1, 0], [0, -1]];

const toFixed = (...nums) => {
  const converted = nums.map((n) => {
    var pow = Math.pow(10, 4);
    return Math.round(n*pow) / pow;
  })
  return converted.length == 1 ? converted[0] : converted
}

class Body {
  constructor(x, y, w, h, isStatic) {
    [this.x, this.y, this.w, this.h] = [x, y, w, h]
    this.static = !!isStatic
    this.cells = []
  }

  set x(val) { this._x = toFixed(val) }
  get x() { return this._x }
  set y(val) { this._y = toFixed(val) }
  get y() { return this._y }

  add(world) {
    this.world = world
    this.grid = world.grid
    this._addToCells()
  }

  remove() {
    this.cells.forEach((cell) => cell.delete(this))
  }

  move(x, y, filter) {
    [x, y] = toFixed(x, y)
    const [actualX, actualY, collisions] = this.check(x, y, filter)
    this.x = actualX
    this.y = actualY
    this.remove()
    this._addToCells()
    return [actualX, actualY, collisions]
  }

  check(goalX, goalY, filter=((o) => defaultResp)) {
    [goalX, goalY] = toFixed(goalX, goalY)
    const collisions = []
    const visited = new Set([this])

    const visitedFilter = (other) => {
      if (visited.has(other)) { return false }
      return filter(other)
    }

    let projectedCols = this.world.project(this, goalX, goalY, visitedFilter)
    for (;projectedCols.length > 0;) {
      const collision = projectedCols[0]
      const response = this.world.responses[collision.respType]
      if (!visited.has(collision.body) && response) {
        visited.add(collision.body)
        collisions.push(collision)
        const [gx, gy] = response(this.world, collision, this._clone(), goalX, goalY);
        [goalX, goalY] = toFixed(gx, gy)
        projectedCols = this.world.project(this, goalX, goalY, visitedFilter)
      } else {
        projectedCols.unshift()
      }
    }
    return [goalX, goalY, collisions]
  }

  collide(other, goalX, goalY, filter=((o) => defaultResp)) {
    [goalX, goalY] = toFixed(goalX, goalY)
    const collision = {
      respType: filter(other),
      body: other,
      distance: this.distanceTo(other),
      move: { x: toFixed(goalX-this.x), y: toFixed(goalY-this.y) }
    }
    if (!collision.respType) {
      return
    }
    const diff = this._getDiff(other)
    if (diff.containsPoint(0, 0) && collision.move.x == 0 && collision.move.y == 0) {
      let [px, py] = diff._getNearestCorner(0, 0)
      collision.intersection = toFixed(-min(this.w, abs(px)) * min(this.h, abs(py)))
      if (abs(px) < abs(py)) { py = 0 } else { px = 0 }
      collision.normal = {x: sign(px), y: sign(py)}
      collision.touch = {x: this.x+px, y: this.y+py}
      return collision
    }
    const [i, nx, ny] = diff._getRayIntersectionFraction(0, 0, collision.move.x, collision.move.y)
    collision.intersection = i
    collision.normal = {x: nx, y: ny}
    collision.touch = {
      x: toFixed(this.x + collision.move.x*collision.intersection + collision.normal.x*0.1),
      y: toFixed(this.y + collision.move.y*collision.intersection + collision.normal.y*0.1),
    }
    return (i == Infinity) ? false : collision
  }

  distanceTo(other) {
    const [dx, dy] = toFixed(this.x - other.x + (this.w-other.w)/2, this.y - other.y + (this.h-other.h)/2)
    return toFixed(dx*dx + dy*dy)
  }

  containsPoint(px, py) {
    return this.x < px && this.x+this.w > px && this.y < py && this.y+this.h > py
  }

  _addToCells() {
    this.cells = this.grid.cellsInRect(this.x, this.y, this.w, this.h)
    this.cells.forEach((cell) => cell.add(this))
  }

  _getDiff(other) {
    return new Body(other.x - this.x - this.w, other.y - this.y - this.h, this.w + other.w, this.h + other.h)
  }

  _clone() {
    return new Body(this.x, this.y, this.w, this.h)
  }

  _getNearestCorner(px, py) {
    return [nearest(px, this.x, this.x+this.w), nearest(py, this.y, this.y+this.h)]
  }

  _getRayIntersectionFraction(ox, oy, dx, dy) {
    const vec = [ox, oy, ox + dx, oy + dy]
    return [
      [this.x, this.y, this.x, this.y + this.h],
      [this.x, this.y + this.h, this.x + this.w, this.y + this.h],
      [this.x + this.w, this.y + this.h, this.x + this.w, this.y],
      [this.x + this.w, this.y, this.x, this.y],
    ].reduce((retVal, side, i) => {
      const x = this._getRayIntersectionFractionOfFirstRay(vec, side)
      return (x < retVal[0]) ? [x, ...testNormals[i]] : retVal
    }, [Infinity])
  }

  _getRayIntersectionFractionOfFirstRay(vec1, vec2) {
    const [rx, ry] = [vec1[2]-vec1[0], vec1[3]-vec1[1]]
    const [sx, sy] = [vec2[2]-vec2[0], vec2[3]-vec2[1]]
    const numerator = toFixed((vec2[0]-vec1[0])*ry) - toFixed((vec2[1]-vec1[1])*rx)
    const denominator = toFixed(rx*sy) - toFixed(ry*sx)
    if (denominator == 0) {
      return Infinity
    }
    const u = toFixed(numerator / denominator)
    const t = toFixed(((vec2[0]-vec1[0])*sy - (vec2[1]-vec1[1])*sx) / denominator)
    return ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) ? t : Infinity
  }
}

export default Body
