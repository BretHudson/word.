const words = [];
const wordsInPlay = [];

// TODO(bret): Maybe thing about cheating (copy paste?) - just simply disable the ability to do so

const placeholderText = 'Enter word here';

Element.prototype.setXY = function(x, y) {
	this.style.setProperty('--x', `${x}px`);
	this.style.setProperty('--y', `${y}px`);
};

const addWord = word => {
	// TODO(bret): Case for when they entered a word they already have!
	words.push(word);
	
	const color = Math.floor(Math.random() * 360);
	
	const element = $new('.word').text(word).element();
	element.style.backgroundColor = `hsla(${color}, 100%, 50%, 0.3)`;
	wordsParent.append(element);
	
	const { left, top } = inputParent.getBoundingClientRect();
	element.setXY(left, top);
	
	wordsInPlay.push({ element, left, top });
};

let lastTime;
const update = t => {
	window.requestAnimationFrame(update);
	
	if (lastTime === undefined) {
		lastTime = t;
		return;
	}
	
	const dt = t - lastTime;
	lastTime = t;
	
	for (const word of wordsInPlay) {
		const { element, left, top } = word;
		word.top = top - (dt * 0.1);
		element.setXY(word.left, word.top);
	}
};

let wordsParent, inputParent, inputField;
window.on('DOMContentLoaded', e => {
	wordsParent = document.getElementById('words');
	inputField = document.querySelector('input[name=word]');
	inputParent = inputField.parentElement;
	
	inputField.on('keydown', e => {
		switch (e.key) {
			case ' ':
			case 'Enter': {
				e.preventDefault();
				
				const value = inputField.value.trim();
				
				if (value !== '') {
					addWord(value);
				}
				
				inputField.value = '';
			} break;
		}
	});
	
	inputField.on('focus', e => {
		inputField.placeholder = '';
	});
	
	inputField.on('blur', e => {
		inputField.placeholder = placeholderText;
	});
	
	inputField.placeholder = placeholderText;
	
	window.requestAnimationFrame(update);
});
