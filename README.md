# Bopit
Simple, quick, AABB framework-independent, collision system. We do rectangles only.

### What it Does
* `Bopit` only does axis-aligned bounding-box (AABB) collisions. If you need anything
  more complicated than that (circles, polygons, etc.) use another library.
* Handles tunnelling - all items are treated as "bullets". The fact that we only
  use AABBs allows doing this fast.
* Strives to be fast while being economic in resources
* It's centered on *detection*, but it also offers some (minimal & basic) *collision response*
* Can also return the items that touch a point, a segment or a rectangular zone.
* `Bopit` is _gameistic_ instead of realistic.

# Usage

## World

```
import {World, Body} from 'bopit'

const world = new World()
const body = new Body(0, 0, 10, 10)
body.add(world)
```

### new World(cellSize)

Creates a new virtual space for tracking physical interactions split into cells.

* Parameters *
- `cellSize` Is an optional number. It defaults to 64. It represents the size of
  the sides of the (squared) cells that will be used internally to provide the data.
  In tile based games, it's usually a multiple of the tile side size. So in a game
  where tiles are 32x32, cellSize will be 32, 64 or 128. In more sparse games,
  it can be higher.

* Returns *
- World

### world.queryRect(x, y, width, height)
Queries a rectangle in the world space and will return any bodies that are within
that area.

* Parameters *
- `x` x coordinate, Number
- `y` y coordinate, Number
- `width` width of the rectangle, Number
- `height` height of the rectangle, Number

* Returns *
- [Body] an array of Bodies, will return an empty array if none found

### world.queryPoint(x, y)
Queries a single point in the world and will return any bodies under that point.

* Parameters *
- `x` x coordinate, Number
- `y` y coordinate, Number

* Returns *
- [Body] an array of Bodies, will return an empty array if none found

### world.querySegment(x1, y1, x2, y2)
Queries a line through the space and will return any bodies that are on that line.

* Parameters *
- `x` x coordinate, Number
- `y` y coordinate, Number

* Returns *
- [Body] an array of Bodies, will return an empty array if none found

---

### new Body(x, y, width, height)
Creates a new physical, rectangular object that can collide with other things.

* Parameters *
- `x` x coordinate, Number
- `y` y coordinate, Number
- `width` width of the rectangle, Number
- `height` height of the rectangle, Number

* Returns *
- Body

### body.add(world)
Adds the body to a world

### body.destroy()
Removes the body from the world that it is in.

### body.move(x, y, filter)
Will check the collisions and update the position of the body after the collisions

* Parameters *
- `x` x coordinate, Number
- `y` y coordinate, Number
- `filter` Function(body, collision, goalX, goalY)
  - `body` the body that the check has been run on.
  - `collision` the collision currently in progress
  - `goalX` x position of where the body is headed
  - `goalY` y position of where the body is headed

* Returns *
- `finalX` the final x resting spot after collisions
- `finalY` the final y resting spot after collisions
- `collisions` all of the collision data from collisions that happened along the way

### body.check(x, y, filter)
Same as `move` but without changing the body. This is good for checking before moving.

### body.distanceTo(other)
Returns the distance from one body to another

---

# Example
Try out the example by running `npm start` and then opening `http://localhost:8080/example`

```
import {World, Body} from 'bopit'
const world = new World(32)
const body = new Body(120, 120, 20, 20)
body.add(world)
const wall1 = new Body(100, 100, 400, 10, true)
wall1.add(world)

const [finalX, finalY, collisions] = body.move(body.x - 10, body.y - 10)
```

# Thanks to

- `kikito` https://github.com/kikito/bump.lua for writing such an awesome library
  that I keep re-writing it in other languages.
