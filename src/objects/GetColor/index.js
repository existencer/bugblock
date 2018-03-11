function getColor (words, index) {
  var ret1 = /[^\w^\d]/
  if (words[0] === words[words.length - 1] && words[0] === "'") {
    return '#e6db74'
  }
  if (words[0] === "(" && words[words.length - 1] === ")") {
    if (index !== 0 && index !== words.length - 1)
    return '#f0971f'
  }
  if (symbol2color[words[index]]) {
    return symbol2color[words[index]]
  }
  if (ret1.test(words)) {
    let str = words + '.'
    let word = ''
    let Cword = []
    for (let i = 0; i < str.length; i++) {
      if (!ret1.test(str[i])) {
        word = word + str[i]
      } else {
        if (word2color[word]) {
          if (index < i) {
            Cword[index] = word2color[word]
            break
          }
        } else {
          if (index <= i) {
            Cword[index] = 'white'
            break
          }
        }
        word = ''
      }
    }
    return Cword[index] || 'white'
  } else {
    return word2color[words] || 'white'
  }
}

const word2color = {
  'let': '#60d9ef',
  'class': '#60d9ef',
  'console': '#60d9ef',
  'log': '#60d9ef',
  'constructor': '#60d9ef',
  'push': '#60d9ef',
  'this': '#f0971f',
  'super': '#f0971f',
  'if': '#f36',
  'new': '#f36',
  'return': '#f36',
  'else': '#f36',
  'for': '#f36',
  'import': '#f36',
  'from': '#f36',
  'export': '#f36',
  'default': '#f36',
  'extends': '#f36',
  'Cat': '#a6e22e',
  'Lion': '#a6e22e',
  'speak': '#a6e22e'
}
const symbol2color = {
  '+': '#f36',
  '-': '#f36',
  '*': '#f36',
  '/': '#f36',
  '=': '#f36',
  '>': '#f36',
  '<': '#f36',
  '.': '#fff',
  '(': '#fff',
  ')': '#fff'
}

export default getColor
