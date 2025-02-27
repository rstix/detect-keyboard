// const wordEl = document.querySelector('.word')
// const repeatWordEl = document.querySelector('.repeat-word')

// const words = ['pes','kocka','dum','voda']

// const selectWord = (words) => {
//   return words[Math.floor((Math.random() * words.length))]
// }

// const selectedWord = selectWord(words)

// wordEl.innerHTML = selectedWord

const dot = '&#183;';

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

// https://youtu.be/SwHCaLGOadM

const VIDEO_ID = 'SwHCaLGOadM';

var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.getElementsByTagName('script')[0].parentNode.insertBefore(tag, null);

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '360',
		width: '640',
		videoId: VIDEO_ID,
		playerVars: {
			controls: 0,
			disablekb: 1,
			// 'modestbranding': 1,
			// 'rel': 0,
			// 'showinfo': 0,
			// 'autoplay': 1,
			// 'loop': 1,
			// 'playlist': VIDEO_ID,
			// 'cc_load_policy': 1,
			// 'cc_lang_pref': 'en',
			// 'enablejsapi': 1,
			// fs: 0,
			// 'iv_load_policy': 3,
			// 'start': 0,
			// 'end': 10
		},
		events: {
			onReady: onPlayerReady,
		},
	});
	player.addEventListener('onStateChange', (event) => {
		if (event.data === YT.PlayerState.PLAYING) {
			updateSubtitles();
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function updateSubtitles() {
	const currentTime = player.getCurrentTime() + 0.2;
	// console.log(currentTime);
	// console.log(
	// 	currentTime,
	// 	subtitles[0].endTime
	// 	// selectedWord,
	// 	// guessed.join(''),
	// 	// selectedWord != guessed.join('')
	// );
	if (
		currentTime > subtitles[0].endTime &&
		selectedWord != guessed.join('') &&
		player.getPlayerState() == 1
	) {
		console.log('pause');
		player.pauseVideo();
	}

	if (subtitles[0].endTime < currentTime && doneWithLine) {
		console.log(currentTime, 'done');
		// setTimeout(() => {
		subtitles.splice(0, 1);
		guessed = [];
		selectedWord = '';
		player.playVideo();
		doneWithLine = false;
		// }, 500);
	}

	selectedWord = subtitles[0].missingWord1;
	firstLine.innerHTML = subtitles[0].subsLine1.replace(
		subtitles[0].missingWord1,
		`<span class='missing-word1'>${selectedWord.substring(
			0,
			guessed.length
		)}${dot.repeat(selectedWord.length - guessed.length)}</span>`
	);
	secondLine.innerHTML = subtitles[0].subsLine2;

	requestAnimationFrame(updateSubtitles);
}

let subtitles = [];

fetch('Friends_Stalin.srt')
	.then((response) => response.text())
	.then((text) => parseText(text));

const parseText = (text) => {
	const splittedOnLines = text.split(/\n\s*\n/);
	splittedOnLines.forEach((line) => {
		const eachLineSplitted = line.split('\n');

		// console.log(eachLineSplitted);
		subtitles.push({
			startTime: stringTimeToDecimal(
				eachLineSplitted[1].split('-->')[0].trim()
			),
			endTime: stringTimeToDecimal(eachLineSplitted[1].split('-->')[1].trim()),
			subsLine1: eachLineSplitted[2],
			subsLine2: eachLineSplitted.length > 3 ? eachLineSplitted[3] : '',
			hasMissingWord1: countWords(eachLineSplitted[2]) > 2,
			missingWord1: chooseMissingWord(eachLineSplitted[2]),
			hasMissingWord2:
				eachLineSplitted.length > 3
					? countWords(eachLineSplitted[3]) > 2
					: false,
			missingWord2:
				eachLineSplitted.length > 3
					? chooseMissingWord(eachLineSplitted[3])
					: '',
		});
	});

	console.log(subtitles);
	//  = subtitles[0].startTime - 1;
};

const stringTimeToDecimal = (str) => {
	const hours = parseFloat(str.substring(0, 2));
	const mins = parseFloat(str.substring(3, 5));
	const secs = parseFloat(
		`${str.substring(6, 8)}.${str.substring(9, str.length)}`
	);

	return 3600 * hours + 60 * mins + secs;
};

const chooseMissingWord = (str = '') => {
	const wordsArr = str.split(' ');
	const nbr = Math.floor(Math.random() * (wordsArr.length - 1));
	const word = wordsArr[nbr];

	return cleanUpWord(word);
};

const cleanUpWord = (word) => {
	return word.replace(/[?!.,]+/, '');
};

const countWords = (str) => {
	return str.split(' ').length;
};

// const video = document.querySelector('video');
const subtitlesEl = document.querySelector('.subtitles');
const firstLine = document.querySelector('.first-line');
const secondLine = document.querySelector('.second-line');

let selectedWord = '';

let guessed = [];

let doneWithLine = false;

const setRepeatWord = (word) => {
	document.querySelector('.missing-word1').innerHTML = word;
};

document.addEventListener('keyup', (e) => {
	const currentTime = player.getCurrentTime();
	console.log(e.key, selectedWord[guessed.length], guessed, selectedWord);
	if (e.key == 'Backspace') {
		// currentTime = subtitles[0].startTime;
		player.seekTo(subtitles[0].startTime - 0.2);
		player.playVideo();
	}

	if (
		e.key == selectedWord[guessed.length] ||
		e.key.toLocaleUpperCase() == selectedWord[guessed.length]
	) {
		guessed.push(selectedWord[guessed.length]);
		setRepeatWord(
			`${guessed.join('')}${dot.repeat(selectedWord.length - guessed.length)}`
		);
	}
	if (guessed.join('') == selectedWord && currentTime > subtitles[0].endTime) {
		currentTime = subtitles[0].startTime;
		setTimeout(() => {
			player.playVideo();
		}, 500).then(() => {
			console.log('play');
		});
	}

	if (guessed.join('') == selectedWord) {
		doneWithLine = true;
	}
});

// video.addEventListener('timeupdate', () => {
// 	console.log(
// 		video.currentTime,
// 		subtitles[0].endTime,
// 		selectedWord,
// 		guessed.join(''),
// 		selectedWord != guessed.join('')
// 	);
// 	if (
// 		video.currentTime > subtitles[0].endTime &&
// 		selectedWord != guessed.join('')
// 	) {
// 		video.pause();
// 	}

// 	if (subtitles[0].endTime < video.currentTime && !doneWithLine) {
// 		subtitles.splice(0, 1);
// 		guessed = [];
// 		selectedWord = '';
// 	}

// 	selectedWord = subtitles[0].missingWord1;
// 	firstLine.innerHTML = subtitles[0].subsLine1.replace(
// 		subtitles[0].missingWord1,
// 		`<span class='missing-word1'>${selectedWord.substring(
// 			0,
// 			guessed.length
// 		)}${dot.repeat(selectedWord.length - guessed.length)}</span>`
// 	);
// 	secondLine.innerHTML = subtitles[0].subsLine2;
// });
