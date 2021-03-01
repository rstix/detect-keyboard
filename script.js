// const wordEl = document.querySelector('.word')
// const repeatWordEl = document.querySelector('.repeat-word')

// const words = ['pes','kocka','dum','voda']

// const selectWord = (words) => {
//   return words[Math.floor((Math.random() * words.length))]
// }

// const selectedWord = selectWord(words)

// wordEl.innerHTML = selectedWord

// const dot = '&#183;'

// let repeatWord = dot.repeat(selectedWord.length)

// const setRepeatWord = (repeatWord) => {
//   repeatWordEl.innerHTML = repeatWord
// }

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

fetch('friends_stalin.txt')
  .then(response => response.text())
  .then(text => parseText(text))

const parseText = (text) => {
  const splittedOnLines = text.split(/\n\s*\n/)
  splittedOnLines.forEach(line => {
    const eachLineSplitted = line.split('\n')
    // console.log(countWords(eachLineSplitted[2]))
    subtitles.push({
      startTime: stringTimeToDecimal(eachLineSplitted[1].split('-->')[0].trim()),
      endTime: stringTimeToDecimal(eachLineSplitted[1].split('-->')[1].trim()),
      subs: `<p class="first-line">${eachLineSplitted[2]}</p> ${eachLineSplitted[3] ? '<p class="second-line">'+eachLineSplitted[3]+'</p>': ''}`,
      hasMissingWord: countWords(eachLineSplitted[2])>2,
      missingWord: chooseMissingWord(eachLineSplitted[2])
    })
  })
}

const stringTimeToDecimal = (str) =>{
  const hours = parseFloat(str.substring(0, 2));
  const mins = parseFloat(str.substring(3, 5));
  const secs = parseFloat(`${str.substring(6, 8)}.${str.substring(9, str.length)}`);
  
  return 3600*hours+60*mins+secs
}

const chooseMissingWord = (str) => {
  const wordsArr = str.split(' ')
  // console.log(wordsArr)
  return wordsArr[Math.floor(Math.random()*wordsArr.length)]
}

const countWords = (str) => {
  return str.split(' ').length
}

const video = document.querySelector('video')
const subtitlesEl = document.querySelector('.subtitles')
const secondLine = document.querySelector('.second-line')

video.addEventListener('timeupdate',()=>{
  console.log(subtitles)
  subtitles.forEach(sub => {
    
    if(sub.startTime - subtitles[0].startTime + 1.5 < video.currentTime && sub.endTime - subtitles[0].startTime + 1.5 > video.currentTime){
      subtitlesEl.innerHTML = sub.subs
    }
  })
})




