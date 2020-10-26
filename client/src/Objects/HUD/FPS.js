import '../Components/Gauges.css';

export default class FPS {
	constructor(container, { data }) {
		const node = document.createElement('div');
		node.innerHTML = require('../Components/Gauges.html');
		container.appendChild(node);

		this.HTML = node;

		setInterval(() => {
			this.HTML.children[0].children[0].textContent = `${data.get()}fps`;
			data.set(0);
		}, 1000);
	}

	update() {}
}
