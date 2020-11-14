import './Blocked.css';
export default class Blocked {
	constructor() {
		const node = document.createElement('div');
		node.style.width = '100vw';
		node.style.height = '100vh';
		node.style.zIndex = '100';

		node.style.position = 'absolute';
		node.style.top = '0';
		node.style.left = '0';

		node.style.display = 'flex';
		node.style.justifyContent = 'center';
		node.style.alignItems = 'center';

		node.innerHTML = require('./Blocked.html');

		this.HTML = node;
		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';
	}

	show() {
		document.body.appendChild(this.HTML);
		setTimeout(() => {
			this.HTML.style.opacity = '1';
		}, 100);
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}
