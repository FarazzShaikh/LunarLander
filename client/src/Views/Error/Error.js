import './Error.css';

export default class Error {
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

		node.style.backdropFilter = 'brightness(50%)';

		node.innerHTML = require('./Error.html');

		this.HTML = node;
		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';
	}

	show({ title, body }) {
		document.body.appendChild(this.HTML);
		this.HTML.style.opacity = '1';
		setTimeout(() => {
			document.querySelector('.Error-container .title').textContent = title;
			document.querySelector('.Error-container .message').textContent = body;
			document
				.querySelector('.Error-container .buttons button')
				.addEventListener('click', () => {
					this.hide();
				});
		}, 100);
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}
