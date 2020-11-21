import './DevScreen.css';

export default class DevScreen {
	constructor() {
		const node = document.createElement('div');
		node.innerHTML = require('./DevScreen.html');

		this.HTML = node;

		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';
	}

	show(callback) {
		document.body.appendChild(this.HTML);
		setTimeout(() => {
			this.HTML.style.opacity = '1';
			this.HTML.querySelector('.host').textContent =
				'Host:' + truncate(location.hostname, 10);
			setTimeout(() => {
				callback();
			}, 2000);
		}, 100);
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}

function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '...' : str;
}
