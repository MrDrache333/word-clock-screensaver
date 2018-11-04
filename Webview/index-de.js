/* global document */

'use strict';

/** DOM
----------------------------------------------------------------------------- */
const wordClock = document.createElement('word-clock');
document.body.appendChild(wordClock);

// Set wordClock
function updateWordClock(string) {
	if (wordClock.innerText.toLowerCase() === string) {
		return;
	}
	const currentChars = Array.from(wordClock.innerText.toLowerCase());
	const newChars = Array.from(string.toLowerCase());

	let overlapCharCount = 0;
	if (wordClock.innerText.toLowerCase().includes('uhr') && string.toLowerCase().includes('uhr')) {
		overlapCharCount += 2;
	}
	let goon = true
	currentChars.forEach((char, i) => {

		if (char === newChars[i] && goon) {
			overlapCharCount += 1;
		}else {
			goon = false;
		}
	});

	// Take of one by one anything above overlap
	const charsToRemove = (currentChars.length - overlapCharCount) + 1;
	const removeString = currentChars.join('');

	const keystrokeDelay = 100;
	let removeDelayTotal;

	for (let i = 0; i < charsToRemove; i++) {
		setTimeout(() => {
			let newstring = removeString.slice(0, currentChars.length - i);
			console.log(newstring)
			setWordClock(newstring)
		}, keystrokeDelay * i)
		removeDelayTotal = keystrokeDelay * i;
	}

	// Put on one by one new chars above overlap
	const charsToAdd = (newChars.length - overlapCharCount) + 1;
	const addString = newChars.join('');
	for (let i = 0; i < charsToAdd; i++) {
		setTimeout(() => {
			let newstring = addString.slice(0, overlapCharCount + i);
			console.log(newstring);
			setWordClock(newstring)
		}, (keystrokeDelay * i) + removeDelayTotal)
	}

}

function setWordClock(string) {
	// Franklin Gothic Black needs a bit of TLC
	string = string.replace('Uhr', 'uhr');
	string = string.replace('uhr', 'Uhr<br>');
	string = string.replace('pa', '<span class="kern">p</span>a');
	string = string.replace('lv', '<span class="kern">l</span>v');
	wordClock.innerHTML = string;
}

/** Init / Update Clock
----------------------------------------------------------------------------- */
let lastTime = 0;

function update() {
	if (lastTime != getTime().m){
		const words = getTimeWordsDE(getTime());
		updateWordClock(words);
		lastTime = getTime().m;
	}
}

setInterval(update, 2500);
update();


// Get Time
function getTime() {
	const now = new Date();
	return {
		h: now.getHours(),
		m: now.getMinutes()
	};
}

/** Time to word conversion - English
----------------------------------------------------------------------------- */

/** Time to words in English
 *
 * @param {object} time - Current time
 * @param {number} time.h - Current hour [0-23]
 * @param {number} time.m - Current minute [0-59]
 * @returns {string} The provided time in words, in an english-sounding way.
 */
function getTimeWordsDE(time) {
	// Midday
	if (parseInt(time.h, 10) === 12 && parseInt(time.m, 10) === 0) {
		return `Mittag`;
	}
	// Midnight
	if (parseInt(time.h, 10) === 0 && parseInt(time.m, 10) === 0) {
		return `Mitternacht`;
	}

	// One minute past [hour]
	if (parseInt(time.m, 10) === 1) {
		return `eine Minute nach ${hourIntToWord(time.h)}`;
	}

	// [minutes >= 12] past [hour]
	if (time.m >= 2 && time.m <= 12) {
		return `${minutesIntToWord(time.m)} nach ${hourIntToWord(time.h)}`;
	}

	// [something] past/to [hour]
	switch (time.m) { // eslint-disable-line default-case
		case 0:
			return `${hourIntToWord(time.h)} Uhr`;
		case 15:
			return `viertel nach ${hourIntToWord(time.h)}`;
		case 20:
			return `zwanzig nach ${hourIntToWord(time.h)}`;
		case 30:
			return `halb ${hourIntToWord(time.h + 1)}`;
		case 40:
			return `zwanzig vor ${hourIntToWord(time.h + 1)}`;
		case 45:
			return `viertel vor ${hourIntToWord(time.h + 1)}`;
		case 50:
			return `zehn vor ${hourIntToWord(time.h + 1)}`;
		case 55:
			return `fünf vor ${hourIntToWord(time.h + 1)}`;
	}

	// No special case, just [hour] [minutes]
	return `${hourIntToWord(time.h)} Uhr ${minutesIntToWord(time.m)} `;
}

function hourIntToWord(int) { // eslint-disable-line complexity
	switch (parseInt(int, 10)) { // eslint-disable-line default-case
		case 0:
		case 24: // Next hour + 1, twenty, quarter, ten, five to.
		case 12:
			return 'zwölf';
		case 1:
		case 13:
			return 'ein';
		case 2:
		case 14:
			return 'zwei';
		case 3:
		case 15:
			return 'drei';
		case 4:
		case 16:
			return 'vier';
		case 5:
		case 17:
			return 'fünf';
		case 6:
		case 18:
			return 'sechs';
		case 7:
		case 19:
			return 'sieben';
		case 8:
		case 20:
			return 'acht';
		case 9:
		case 21:
			return 'neun';
		case 10:
		case 22:
			return 'zehn';
		case 11:
		case 23:
			return 'elf';
	}
}

function minutesIntToWord(int) {
	if (int <= 19) {
		return baseIntToWord(int);
	}
	if (int >= 20) {
		const tens = tensIntToWord(int.toString()[0] * 10);
		const units = baseIntToWord(int.toString()[1]);
		return `${units}und${tens} `;
	}
}

function baseIntToWord(int) {
	switch (parseInt(int, 10)) { // eslint-disable-line default-case
		case 1:
			return 'ein';
		case 2:
			return 'zwei';
		case 3:
			return 'drei';
		case 4:
			return 'vier';
		case 5:
			return 'fünf';
		case 6:
			return 'sechs';
		case 7:
			return 'sieben';
		case 8:
			return 'acht';
		case 9:
			return 'neun';
		case 10:
			return 'zehn';
		case 11:
			return 'elf';
		case 12:
			return 'zwölf';
		case 13:
			return 'dreizehn';
		case 14:
			return 'vierzehn';
		case 15:
			return 'fünfzehn';
		case 16:
			return 'sechzehn';
		case 17:
			return 'siebzehn';
		case 18:
			return 'achzehn';
		case 19:
			return 'neunzehn';
	}
}

function tensIntToWord(int) {
	switch (parseInt(int, 10)) { // eslint-disable-line default-case
		case 10:
			return 'zehn';
		case 20:
			return 'zwanzig';
		case 30:
			return 'dreißig';
		case 40:
			return 'vierzig';
		case 50:
			return 'fünfzig';
	}
}
