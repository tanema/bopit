# Bop
Simple, quick, AABB framework-independent, collision system.

### What it Does
* `Bop` only does axis-aligned bounding-box (AABB) collisions. If you need anything
  more complicated than that (circles, polygons, etc.) use another library.
* Handles tunnelling - all items are treated as "bullets". The fact that we only
  use AABBs allows doing this fast.
* Strives to be fast while being economic in resources
* It's centered on *detection*, but it also offers some (minimal & basic) *collision response*
* Can also return the items that touch a point, a segment or a rectangular zone.
* `Bop` is _gameistic_ instead of realistic.


### What it is ideal for

* Tile-based games, platformers, and games where most entities can be represented
  as axis-aligned rectangles.
* Games which require some physics, but not a full realistic simulation - like a platformer.
* Examples of genres: top-down games (Zelda), Shoot-em-ups, fighting games (Street
  Fighter), platformers (Super Mario).

### What it is not a good match for

* Games that require polygons for the collision detection
* Games that require highly realistic simulations of physics - things "stacking
  up", "rolling over slides", etc.
* Games that require very fast objects colliding reallistically against each other
  (in ump, being _gameistic_, objects are moved and collided _one at a time_)
* Simulations where the order in which the collisions are resolved isn't known.

# Usage

## World

```
import {World} from 'bop'

const world = new World()
``

### new World(cellSize)

Creates a new virtual space for tracking physical interactions split into cells.

- `cellSize` Is an optional number. It defaults to 64. It represents the size of
  the sides of the (squared) cells that will be used internally to provide the data.
  In tile based games, it's usually a multiple of the tile side size. So in a game
  where tiles are 32x32, cellSize will be 32, 64 or 128. In more sparse games,
  it can be higher.

#### world.queryRect(x, y, w, h)
#### world.queryPoint(x, y)
#### world.querySegment(x1, y1, x2, y2)

### new Body(x, y, width, height, isStatic)
#### body.add(world)
#### body.destroy()
#### body.move(x, y, filter)
#### body.check(x, y, filter)
#### body.distanceTo(other)

# Example
Try out the example by running `npm start` and then opening `http://localhost:8080/example`

```
import {World, Body} from 'bop'
const world = new World(32)
const body = new Body(120, 120, 20, 20)
body.add(world)
const wall1 = new Body(100, 100, 400, 10, true)
wall1.add(world)

const [finalX, finalY, collisions] = body.move(body.x - 10, body.y - 10)
```
