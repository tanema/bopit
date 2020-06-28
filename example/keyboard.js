class KeyboardState {
  constructor (preventArrows = true) {
    this.state = {}
    this.preventArrows = preventArrows

    this.downHndlr = this.onDown.bind(this)
    this.upHndlr = this.onUp.bind(this)

    this.subscribe()
  }

  isDown (key) {
    return this.state[key]
  }

  shouldPrevent (key) {
    return this.preventArrows && key.startsWith('Arrow')
  }

  onDown (event) {
    if (!this.state[event.key] && this.press) {
      this.press(event.key)
    }
    this.state[event.key] = true
    if (this.shouldPrevent(event.key)) {
      event.preventDefault()
    }
  }

  onUp (event) {
    if (this.state[event.key] && this.release) {
      this.release(event.key)
    }
    this.state[event.key] = false
    if (this.shouldPrevent(event.key)) {
      event.preventDefault()
    }
  }

  subscribe () {
    window.addEventListener('keydown', this.downHndlr)
    window.addEventListener('keyup', this.upHndlr)
  }

  unsubscribe () {
    window.removeEventListener('keydown', this.downHndlr)
    window.removeEventListener('keyup', this.upHndlr)
  }
}

const Keyboard = new KeyboardState()

export default Keyboard
