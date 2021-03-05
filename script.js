// const wordEl = document.querySelector('.word')
// const repeatWordEl = document.querySelector('.repeat-word')

// const words = ['pes','kocka','dum','voda']

// const selectWord = (words) => {
//   return words[Math.floor((Math.random() * words.length))]
// }

// const selectedWord = selectWord(words)

// wordEl.innerHTML = selectedWord

const dot = '&#183;'

// let repeatWord = dot.repeat(selectedWord.length)



// setRepeatWord(repeatWord)

// let guessed = []

// document.addEventListener('keypress',(e)=>{
//   console.log(e.key,selectedWord[guessed.length],guessed)
//   if(e.key == selectedWord[guessed.length]){
//     guessed.push(e.key)
//     setRepeatWord(`${guessed.join('')}${dot.repeat(selectedWord.length-guessed.length)}`)
    
//   }
// })

let subtitles = []
let timeOffset

fetch('friends_stalin.txt')
  .then(response => response.text())
  .then(text => parseText(text))

const parseText = (text) => {
  const splittedOnLines = text.split(/\n\s*\n/)
  splittedOnLines.forEach(line => {
    const eachLineSplitted = line.split('\n')

    subtitles.push({
      startTime: stringTimeToDecimal(eachLineSplitted[1].split('-->')[0].trim()),
      endTime: stringTimeToDecimal(eachLineSplitted[1].split('-->')[1].trim()),
      subsLine1: eachLineSplitted[2],
      subsLine2: eachLineSplitted.length>3 ? eachLineSplitted[3] : '',
      hasMissingWord1: countWords(eachLineSplitted[2])>2,
      missingWord1: chooseMissingWord(eachLineSplitted[2]),
      hasMissingWord2: eachLineSplitted.length>3 ? countWords(eachLineSplitted[3])>2 : false,
      missingWord2: eachLineSplitted.length>3 ? chooseMissingWord(eachLineSplitted[3]) : ""
    })
  })
  timeOffset = subtitles[0].startTime
}

const stringTimeToDecimal = (str) =>{
  const hours = parseFloat(str.substring(0, 2));
  const mins = parseFloat(str.substring(3, 5));
  const secs = parseFloat(`${str.substring(6, 8)}.${str.substring(9, str.length)}`);

  return 3600*hours+60*mins+secs
}

const chooseMissingWord = (str = '') => {
  const wordsArr = str.split(' ')
  const nbr = Math.floor(Math.random()*(wordsArr.length-1))
  const word = wordsArr[nbr]

  return cleanUpWord(word)
}

const cleanUpWord = (word) => {
  return word.replace(/[?!.,]+/,'')
}

const countWords = (str) => {
  return str.split(' ').length
}


const video = document.querySelector('video')
const subtitlesEl = document.querySelector('.subtitles')
const firstLine = document.querySelector('.first-line')
const secondLine = document.querySelector('.second-line')

let selectedWord = ''

let guessed = []

let doneWithLine = false

const setRepeatWord = (word) => {
  document.querySelector('.missing-word1').innerHTML = word
}


document.addEventListener('keyup', (e) => {

  if (e.key == "Backspace") {
    // video.pause()
    video.currentTime = subtitles[0].startTime - timeOffset + 1.5
    video.play()
  }

  if(e.key == selectedWord[guessed.length]){
    guessed.push(e.key)
    setRepeatWord(`${guessed.join('')}${dot.repeat(selectedWord.length-guessed.length)}`)
  }
  if (guessed.join('') == selectedWord && video.currentTime > subtitles[0].endTime - timeOffset + 1.2) {
    video.currentTime = subtitles[0].startTime-timeOffset+1.5
    video.play()
  }
})


video.addEventListener('timeupdate', () => {
  
  if (subtitles[0].endTime - timeOffset + 1.5 < video.currentTime) {
    subtitles.splice(0, 1)
    guessed = []
    selectedWord = ''
  }

  selectedWord = subtitles[0].missingWord1
  firstLine.innerHTML = subtitles[0].subsLine1.replace(subtitles[0].missingWord1,`<span class='missing-word1'>${guessed.join('')}${dot.repeat(selectedWord.length-guessed.length)}</span>`)
  secondLine.innerHTML = subtitles[0].subsLine2


  if (video.currentTime > subtitles[0].endTime - timeOffset + 1.2 && selectedWord != guessed.join('')) {
    video.pause()
  }
    
})





