function getColor (words, index) {
  var ret1 = /[^\w^\d]/
  if (ret1.test(words)) {
    let str = words + '.'
    let word = ''
    let Cword = []
    for (let i = 0; i < str.length; i++) {
      if (!ret1.test(str[i])) {
        word = word + str[i]
      } else {
        if (word2color[word]) {
          if (index <= i) {
            Cword[index] = word2color[word]
            break
          }
        } else {
          if (index <= i) {
            Cword[index] = word2color['default']
            break
          }
        }
        word = ''
      }
    }
    return Cword[index] || word2color['default']
  } else {
    return word2color[words] || word2color['default']
  }
}

const word2color = {
  'let': '#36b4e5',
  'if': '#f36',
  'return': '#f36',
  'else': '#f36',
  'for': '#f36',
  'console': 'green',
  'Array': 'green',
  'import': '#f36',
  'from': '#f36',
  'export': '#f36',
  'default': 'white'
}

export default getColor
