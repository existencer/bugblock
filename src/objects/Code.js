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


class Cat { 
  constructor (name) {
    this.name = name;
  }
  
  speak () {
    console.log(this.name + 'makes a noise.');
  }
}

class Lion extends Cat {
  speak () {
    super.speak();
    console.log(this.name + 'roars.');
  }
}