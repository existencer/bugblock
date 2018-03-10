class Rect2d {
  constructor (x, y, w, h) {
    this.w = w || 100
    this.h = h || 100
    this.x = x
    this.y = y
  }

  checkImpact (obj, dir) {
    let hw = (this.w + obj.w) / 2
    let hh = (this.h + obj.h) / 2
    let dx = Math.abs(this.cx - obj.cx)
    let impactPoint = false
    // 碰撞
    if (Math.abs(obj.cx + dir.x - this.cx) < hw && Math.abs(obj.cy + dir.y - this.cy) < hh) {
      // y轴方向碰撞
      if (dx < hw) {
        dir.y *= -1
        impactPoint = {x: obj.cx, y: dir.y > 0 ? this.y + this.h : this.y}
      } else {
        dir.x *= -1
        impactPoint = {x: dir.x > 0 ? this.x + this.w : this.x, y: obj.cy}
      }
    }
    if (impactPoint && this.onImpact) {
      this.onImpact(impactPoint)
    }
    return impactPoint
  }

  set x (value) {
    this._x = value
    this.cx = value + this.w / 2
  }
  get x () {
    return this._x
  }
  set y (value) {
    this._y = value
    this.cy = value + this.h / 2
  }
  get y () {
    return this._y
  }
}
export default Rect2d
