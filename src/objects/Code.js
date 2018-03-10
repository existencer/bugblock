import Rect2d from 'Rect2d.js'
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