function Rect2d (x, y, w, h) {
  this.x = x
  this.y = y
  this.w = w || 100
  this.h = h || 100
  this.cx = this.x + this.w / 2
  this.cy = this.y + this.h / 2
}
Rect2d.prototype.checkImpact = function (obj, dir) {
  let hw = (this.w + obj.w) / 2
  let hh = (this.h + obj.h) / 2
  let dx = Math.abs(this.cx - obj.cx)
  let dy = Math.abs(this.cy - obj.cy)
  // 碰撞
  if (dx < hw + Math.abs(dir.x) && dy < hh + Math.abs(dir.y)) {
    // y轴方向碰撞
    if (dx < hw) {
      let spacingY = dy - hh
      let newDirY = -dir.y + spacingY * (dir.y > 0 ? -1 : 1)
      // dir.y = newDirY
      dir.y *= -1
    } else {
      let spacingX = dx - hw
      let newDirX = -dir.x + spacingX * (dir.x > 0 ? -1 : 1)
      // dir.x = newDirX
      dir.x *= -1
    }
  }
}
export default Rect2d
