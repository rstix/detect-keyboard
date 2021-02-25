const wordEl = document.querySelector('.word')
const repeatWordEl = document.querySelector('.repeat-word')

const words = ['pes','kocka','dum','voda']

const selectWord = (words) => {
  return words[Math.floor((Math.random() * words.length))]
}

const selectedWord = selectWord(words)

wordEl.innerHTML = selectedWord

const dot = '&#183;'

let repeatWord = dot.repeat(selectedWord.length)

const setRepeatWord = (repeatWord) => {
  repeatWordEl.innerHTML = repeatWord
}

setRepeatWord(repeatWord)

let guessed = []

document.addEventListener('keypress',(e)=>{
  console.log(e.key,selectedWord[guessed.length],guessed)
  if(e.key == selectedWord[guessed.length]){
    guessed.push(e.key)
    setRepeatWord(`${guessed.join('')}${dot.repeat(selectedWord.length-guessed.length)}`)
    
  }
})