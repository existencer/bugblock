import Rect2d from './Rect2d.js'
class Line {
  constructor (el) {
    this.el = el
    let parent = el.parentElement
    let rect = el.getBoundingClientRect()
    let parentRect = parent.getBoundingClientRect()
    let x = rect.left - parentRect.left
    let y = rect.top - parentRect.top
    this.rect = new Rect2d(x + 10, y + 10, rect.width, rect.height)
  }
}
export default Line
