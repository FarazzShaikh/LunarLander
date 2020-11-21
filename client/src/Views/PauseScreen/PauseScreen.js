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
	}

	listener(e) {
		console.log(e.code);
		if (e.code === 'Escape') INTERRUPT.set('PAUSE', false);
	}

	show() {
		document.body.appendChild(this.HTML);
		this.HTML.style.opacity = '1';
		document.addEventListener('keydown', this.listener);
	}

	hide() {
		document.removeEventListener('keydown', this.listener);
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}
