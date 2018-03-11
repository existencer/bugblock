<template>
  <div id="game">
    <div id="game-box">
      <div id="game-code-box">
        <div v-for="line in codeLists" :key="codeLists.indexOf(line)" class="line">
          <div v-for="code in line" :key="line.indexOf(code)" class="code">
            <div v-for="letter in code" :key="letter.i" :style="{'color': letter.color ? letter.color : 'white'}">{{letter.char}}</div>
          </div>
        </div>
      </div>
      <div id="ball"></div>
      <div id="baffle" :style="{'height': `${baffleLength}px`}"></div>
      <div id="animate-code"></div>
      <canvas id="test" width="1200" height="800"></canvas>
    </div>
    <p id="game-life"><span style="float: left">score: {{score}}</span><span style="float: right">life: {{life}}</span></p>
  </div>
</template>

<script>
import Rect2d from '@/objects/Rect2d.js'
import Line from '@/objects/Line.js'
import getColor from '@/objects/GetColor'

const life = 3
const speed = 12
const baffleLength = 60
const flashLife = 30

let defaultCode = `import Rect2d from 'Rect2d.js'
import Letter from 'Letter.js'
class Code {
  constructor (word, color) {
    this.letters = []
    for (let i = 0; i < word.length; i++) {
      this.letters.push(new Letter(word[i]))
    }
    this.color = color
  }
}
export default Code
`

export default {
  name: 'game',
  data: () => {
    return {
      isPause: true,
      life,
      box: null,
      ball: null,
      baffle: null,
      animateCode: null,
      ballPosition: {
        x: 0,
        y: 0
      },
      ballDirection: {
        x: 0,
        y: 0
      },
      rectLists: {},
      ctx: null,
      baffleY: 300,
      baffleLength,
      codeLists: [],
      pointList: [],
      isGameOver: false,
      score: 0
    }
  },
  mounted () {
    this.initElement()
    this.initBallDirection()
    this.$el.addEventListener('mousemove', (e) => {
      let y = Math.max(30, Math.min(e.pageY - 50, 570))
      this.baffleY = y
    })
    this.$el.addEventListener('mousedown', (e) => {
      this.isPause = false
    })
    requestAnimationFrame(this.animate)
  },
  methods: {
    animate (timer) {
      if (this.isPause) {
        this.ballPosition.x = 0
        this.ballPosition.y = this.baffleY - 300
      } else {
        this.ballMove()
      }
      this.updateFlash()
      this.render()
      if (!this.isGameOver) {
        requestAnimationFrame(this.animate)
      }
    },
    initElement () {
      this.box = this.$el.querySelector('#game-box')
      this.ball = this.$el.querySelector('#ball')
      this.baffle = this.$el.querySelector('#baffle')
      this.animateCode = this.$el.querySelector('#animate-code')
      this.ctx = this.$el.querySelector('#test').getContext('2d')
      this.ctx.translate(100, 100)
      this.ctx.fillStyle = 'red'
      this.addRect2d('topWall', 0, -100, 1000, 100)
      this.addRect2d('leftWall', -100, 0, 110, 600)
      this.addRect2d('bottomWall', 0, 600, 1000, 100)
      this.addRect2d('rightWall', 1000, 0, 100, 600)
      this.rectLists['rightWall'].onImpact = (point) => {
        if (this.life === 1) {
          window.score = this.score
          this.isGameOver = true
          this.$router.push('/gameover')
          // window.location.hash = '#/gameover'
        } else {
          this.life--
          this.initBallDirection()
          let i = 0
          let sitv = setInterval(() => {
            this.box.style.transform = `translate3d(${Math.random() * 8 - 8}px,${Math.random() * 5 - 5}px,0)`
            if (i++ === 8) {
              clearInterval(sitv)
            }
          }, 30)
        }
      }
      this.addRect2d('baffle', 970, 300 - this.baffleLength / 2, 10, 60)
      this.rectLists['baffle'].onImpact = (point) => {
        let dy = (point.y - this.baffleY) / this.baffleLength
        this.ballDirection.y += dy * 8
      }

      if (window.code) {
        defaultCode = window.code
      }
      let i = 0
      let letter
      while (i < defaultCode.length) {
        let line = []
        while (i < defaultCode.length) {
          let nextWord = ''
          for (let j = i; j < defaultCode.length; j++) {
            let letter = defaultCode[j]
            if (letter === ' ' || letter === '\n') {
              break
            } else {
              nextWord += letter
            }
          }
          let code = []
          let index = 0
          while (i < defaultCode.length) {
            letter = defaultCode[i++]
            let color = getColor(nextWord, index)
            index++
            if (letter === ' ' || letter === '\n') {
              break
            } else {
              code.push({
                char: letter,
                color,
                i
              })
            }
          }
          if (code.length) {
            line.push(code)
          }
          if (letter === '\n') {
            break
          }
          line.push([{char: ' ', i}])
        }
        this.codeLists.push(line)
      }
      window.list = this.codeLists
      // console.log(this.codeLists)

      this.$nextTick(() => {
        let lines = document.querySelectorAll('.line')
        for (let i = 0; i < lines.length; i++) {
          const element = lines[i]
          let line = new Line(element)
          let codeList = this.codeLists[i]
          this.rectLists['line_' + i] = line.rect
          this.rectLists['line_' + i].onImpact = (point) => {
            let findTheLetter = false
            let lineLength = codeList.length
            let index = Math.floor((point.x - 10) / 11)
            const indexCopy = index
            let letter = null
            for (let codeIndex = 0; codeIndex < lineLength; codeIndex++) {
              if (!codeList[codeIndex]) {
                break
              }
              let codeLength = codeList[codeIndex].length
              if (index < codeLength) {
                letter = codeList[codeIndex].splice(index, 1)
                if (codeList[codeIndex].length === 0) {
                  codeList.splice(codeIndex, 1)
                }
                this.score += letter[0].char.codePointAt(0)
                this.letterFallDown(letter[0].char, indexCopy * 11 + 10, i * 30 + 10, letter[0].color)
                findTheLetter = true
              } else {
                index -= codeLength
              }
            }
            if (!findTheLetter) {
              let lastCode = codeList[lineLength - 1]
              if (lastCode) {
                letter = lastCode.splice(-1, 1)
                this.score += letter[0].char.codePointAt(0)
                this.letterFallDown(letter[0].char, indexCopy * 11 - 1, i * 30 + 10, letter[0].color)
                if (lastCode.length === 0) {
                  codeList.splice(-1, 1)
                }
              }
            }
            if (letter) {
              this.flash(point, letter[0].color)
            }
            this.$nextTick(() => {
              this.rectLists['line_' + i].w = element.getBoundingClientRect().width
              this.rectLists['line_' + i].x = 10
            })
          }
        }
      })
    },
    initBallDirection () {
      this.isPause = true
      this.ballPosition = {x: 0, y: 0}
      let angle = (Math.random() * 0.5 - 0.25) * Math.PI
      let x = -Math.cos(angle) * speed
      let y = Math.sin(angle) * speed
      this.ballDirection = {x, y}
    },
    addRect2d (name, x, y, w, h) {
      this.rectLists[name] = new Rect2d(x, y, w, h)
    },
    checkImpact () {
      let rectLists = this.rectLists
      for (const key in rectLists) {
        if (rectLists.hasOwnProperty(key)) {
          const rect = rectLists[key]
          rect.checkImpact(new Rect2d(this.ballPosition.x + 950, this.ballPosition.y + 290, 20, 20), this.ballDirection)
          // if (point) {
          //   window.ctx.fillRect(point.x - 2, point.y - 2, 4, 4)
          // }
        }
      }
    },
    ballMove () {
      this.rectLists['baffle'].y = this.baffleY - this.baffleLength / 2
      this.checkImpact()
      this.ballPosition.x += this.ballDirection.x
      this.ballPosition.y += this.ballDirection.y
    },
    letterFallDown (char, x, y, color) {
      let letter = document.createElement('div')
      letter.innerHTML = char
      letter.style.top = y + 'px'
      letter.style.left = x + 'px'
      letter.style.color = color
      letter.style.transitionDuration = `${Math.random() * 1.5 + 1}s`
      this.animateCode.appendChild(letter)
      setTimeout(() => {
        letter.style.transform = `translate3d(${Math.random() * 5 - 5}px, 600px, 0) rotate(${Math.random() * 90 - 90}deg)`
        letter.style.opacity = 0
      })
      setTimeout(() => {
        this.animateCode.removeChild(letter)
      }, 3000)
    },
    flash (point, color) {
      let dirs = []
      let speeds = []
      for (let i = 0; i < Math.round(Math.random() * 4) + 4; i++) {
        dirs.push(Math.random() * Math.PI * 2)
        speeds.push(Math.random() * 10 + 5)
      }
      this.pointList.push({
        life: flashLife,
        point,
        dirs,
        speeds,
        color
      })
    },
    updateFlash () {
      for (let i = 0; i < this.pointList.length; i++) {
        let el = this.pointList[i]
        if (!el.life--) {
          this.pointList.splice(i, 1)
          i--
        }
      }
    },
    render () {
      let ctx = this.ctx
      this.ball.style.transform = `translate3d(${this.ballPosition.x}px,${this.ballPosition.y}px,0)`
      this.baffle.style.transform = `translateY(${this.baffleY - 300}px)`
      ctx.clearRect(0, 0, 1000, 600)
      for (let i = 0; i < this.pointList.length; i++) {
        let el = this.pointList[i]
        ctx.save()
        ctx.globalAlpha = el.life / flashLife
        for (let j = 0; j < el.dirs.length; j++) {
          let x = el.point.x + Math.cos(el.dirs[j]) * (1 - el.life / flashLife) * el.speeds[j]
          let y = el.point.y + Math.sin(el.dirs[j]) * (1 - el.life / flashLife) * el.speeds[j]
          ctx.fillStyle = el.color
          ctx.fillRect(x - 1, y - 1, 2, 2)
        }
        ctx.restore()
      }
      // ctx.fillRect(this.ballPosition.x + 955, this.ballPosition.y + 295, 10, 10)
      // let rectLists = this.rectLists
      // for (const key in rectLists) {
      //   if (rectLists.hasOwnProperty(key)) {
      //     const rect = rectLists[key]
      //     ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
      //   }
      // }
    }
  }
}
</script>

<style>
#game {
  font-family: 'Consolas';
}
#game-box {
  width: 1000px;
  height: 600px;
  margin: 50px auto 0;
  border-radius: 10px;
  border: solid 10px gray;
  position: relative;
  overflow: hidden;
  cursor: none;
  background-color: #272822;
}
#game-code-box {
  color: #fff;
  font-size: 20px;
  line-height: 30px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9;
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
#baffle {
  width: 4px;
  margin: 0 3px;
  background-color: white;
  position: absolute;
  right: 20px;
  top: 270px;
}
#baffle:before {
  content: '';
  width: 10px;
  height: 4px;
  position: absolute;
  top: 0;
  left: -3px;
  background-color: white;
}
#baffle:after {
  content: '';
  width: 10px;
  height: 4px;
  position: absolute;
  bottom: 0;
  left: -3px;
  background-color: white;
}
#test {
  position: absolute;
  top: -100px;
  left: -100px;
}
#animate-code {
  width: 1000px;
  height: 600px;
  position: absolute;
  top: 0;
  left: 0;
}
#animate-code div {
  font-size: 20px;
  line-height: 30px;
  position: absolute;
  transform: translate3d(0, 0, 0) rotate(0);
  transition: transform 1.5s cubic-bezier(0.3, -0.2, 0.8, 0.4), opacity 3s;
}
#game-life {
  width: 1000px;
  margin: 10px auto;
  font-size: 18px;
  color: #fff;
}
.line {
  height: 30px;
  display: table;
}
.code {
  height: 30px;
  display: block;
  float: left;
}
.code div {
  width: 11px;
  display: block;
  float: left;
}
</style>
