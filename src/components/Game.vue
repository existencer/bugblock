<template>
  <div id="game-box">
    <div id="ball"></div>
    <canvas id="test" width="1200" height="800"></canvas>
  </div>
</template>

<script>
import Rect2d from '@/objects/Rect2d.js'

const speed = 6

export default {
  name: 'game',
  data: () => {
    return {
      ball: null,
      ballPosition: {
        x: 0,
        y: 0
      },
      ballDirection: {
        x: 0,
        y: 0
      },
      rectLists: {},
      ctx: null
    }
  },
  mounted () {
    this.initElement()
    this.initBallDirection()
    requestAnimationFrame(this.animate)
  },
  methods: {
    animate (timer) {
      this.ballMove()
      this.render()
      requestAnimationFrame(this.animate)
    },
    initElement () {
      this.ball = this.$el.querySelector('#ball')
      window.ctx = this.$el.querySelector('#test').getContext('2d')
      ctx.translate(100, 100)
      this.rectLists.topWall = new Rect2d(0, -100, 1000, 100)
      this.rectLists.leftWall = new Rect2d(-100, 0, 100, 600)
      this.rectLists.bottomWall = new Rect2d(0, 600, 1000, 100)
      this.rectLists.rightWall = new Rect2d(1000, 0, 100, 600)
    },
    initBallDirection () {
      let angle = (Math.random() * 0.5 - 0.25) * Math.PI
      let x = -Math.cos(angle) * speed
      let y = Math.sin(angle) * speed
      console.log(angle, x, y)
      this.ballDirection = {x, y}
    },
    checkImpact () {
      let rectLists = this.rectLists
      for (const key in rectLists) {
        if (rectLists.hasOwnProperty(key)) {
          const rect = rectLists[key]
          rect.checkImpact(new Rect2d(this.ballPosition.x + 950, this.ballPosition.y + 290, 20, 20), this.ballDirection)
        }
      }
    },
    ballMove () {
      this.checkImpact()
      this.ballPosition.x += this.ballDirection.x
      this.ballPosition.y += this.ballDirection.y
    },
    render () {
      this.ball.style.transform = `translate3d(${this.ballPosition.x}px,${this.ballPosition.y}px,0)`
      ctx.clearRect(0, 0, 1000, 600)
      ctx.fillStyle = 'red'
      ctx.fillRect(this.ballPosition.x + 955, this.ballPosition.y + 295, 10, 10)
      let rectLists = this.rectLists
      for (const key in rectLists) {
        if (rectLists.hasOwnProperty(key)) {
          const rect = rectLists[key]
          ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
        }
      }
    }
  }
}
</script>

<style scoped>
#game-box {
  width: 1000px;
  height: 600px;
  margin: 40px auto;
  border-radius: 10px;
  border: solid 1px gray;
  position: relative;
}
#ball {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  right: 30px;
  top: 290px;
}
#test {
  position: absolute;
  top: -100px;
  left: -100px;
}
</style>
