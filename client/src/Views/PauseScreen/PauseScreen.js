import { INTERRUPT } from '../../../../shared/Consts';
import './PauseScreen.css';

export default class PauseScreen {
	constructor() {
		const node = document.createElement('div');
		node.style.width = '100vw';
		node.style.height = '100vh';
		node.style.zIndex = '100';

		node.style.position = 'absolute';
		node.style.top = '0';
		node.style.left = '0';
		node.innerHTML = require('./PauseScreen.html');

		this.HTML = node;
		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';

		this.buttons = {};

		this.isHidden = true;
		this.muteToggle = false;
	}

	listener(e) {
		if (e.code === 'Escape') INTERRUPT.set('PAUSE', false);
		else if (e.code === 'Report')
			window.open('https://github.com/F28WP-Dubai-Group-6/LunarLander/issues/new');
		else if (e.code === 'Controls') {
			const injectPoint = document.querySelector('.inject-html');

			injectPoint.innerHTML = require('./Controls.html');

			document.querySelectorAll('video').forEach((v) => {
				v.playbackRate = 0.5;
			});
			injectPoint.classList.add('inject-html-style');
			injectPoint.classList.add('slide-opacity');
			document
				.querySelector('.PauseScreen-Container .controls-container .icons')
				.addEventListener('click', () => (injectPoint.innerHTML = ''));
		}
	}

	show() {
		this.isHidden = false;
		document.body.appendChild(this.HTML);
		this.HTML.style.opacity = '1';
		document.addEventListener('keydown', this.listener);

		setTimeout(() => {
			document
				.querySelector('.PauseScreen-Container .options .item.resume')
				.addEventListener('click', () => this.listener({ code: 'Escape' }));

			document
				.querySelector('.PauseScreen-Container .options .item.report')
				.addEventListener('click', () => this.listener({ code: 'Report' }));

			document
				.querySelector('.PauseScreen-Container .options .item.controls')
				.addEventListener('click', () => this.listener({ code: 'Controls' }));

			document
				.querySelector('.PauseScreen-Container .icons')
				.addEventListener('click', () => {
					mutePage(this.muteToggle);
					this.muteToggle = !this.muteToggle;
				});
		}, 300);
	}

	hide() {
		this.isHidden = true;
		document.removeEventListener('keydown', this.listener);

		let old_element = document.querySelector(
			'.PauseScreen-Container .options .item.resume'
		);
		let new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);

		old_element = document.querySelector(
			'.PauseScreen-Container .options .item.report'
		);
		new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);

		old_element = document.querySelector('.PauseScreen-Container .icons');
		new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);

		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}

// Mute a singular HTML5 element
function muteMe(elem, muteToggle) {
	elem.muted = muteToggle;
}
// Try to mute all video and audio elements on the page
function mutePage(muteToggle) {
	document.querySelectorAll('audio').forEach((elem) => muteMe(elem, muteToggle));
	document.querySelector('.PauseScreen-Container .icons img').src = !muteToggle
		? 'src/Assets/Icons/Unmute.svg'
		: 'src/Assets/Icons/Mute.svg';
}
