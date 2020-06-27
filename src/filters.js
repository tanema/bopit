const touchFilter = (world, col, body, goalX, goalY) => {
  return [ col.touch.x, col.touch.y ]
}

const crossFilter = (world, col, body, goalX, goalY) => {
  return [ goalX, goalY ]
}

const slideFilter = (world, col, body, goalX, goalY) => {
  if (col.normal.x != 0) {
    goalX = col.touch.x
  } else {
    goalY = col.touch.y
  }
  return [ goalX, goalY ]
}

const bounceFilter = (world, col, body, goalX, goalY) => {
  let [bnx, bny] = [ goalX-col.touch.x, goalY-col.touch.y ]
  if (col.normal.x == 0) {
    bny = -bny
  } else {
    bnx = -bnx
  }
  return [ col.touch.x+bnx, col.touch.y+bny ]
}

export {
  touchFilter,
  crossFilter,
  slideFilter,
  bounceFilter,
}
