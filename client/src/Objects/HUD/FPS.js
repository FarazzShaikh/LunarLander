import '../Components/Gauges.css';

export default class FPS {
	constructor(container, { data }) {
		const node = document.createElement('div');
		node.innerHTML = require('../Components/Gauges.html');
		container.appendChild(node);

		this.HTML = node;
		this.data = data;

		this.velocityX;
		this.velocityY;
		setTimeout(() => {
			this.velocityX = {
				r: document.querySelector(
					'.Gague-container table tbody tr .shape.velx .red'
				),
				y: document.querySelector(
					'.Gague-container table tbody tr .shape.velx .yellow'
				),
				g: document.querySelector(
					'.Gague-container table tbody tr .shape.velx .white'
				),
			};

			this.velocityY = {
				r: document.querySelector(
					'.Gague-container table tbody tr .shape.vely .red'
				),
				y: document.querySelector(
					'.Gague-container table tbody tr .shape.vely .yellow'
				),
				g: document.querySelector(
					'.Gague-container table tbody tr .shape.vely .white'
				),
			};
		}, 2000);

		setInterval(() => {
			this.HTML.children[0].children[0].textContent = `${this.data.get()}fps`;
			this.data.set(0);
		}, 1000);
	}

	calcShapes(value, ele, mul) {
		const a = new Array(20).fill(false);

		if (ele.r && ele.y && ele.g) {
			ele.r.textContent = '';
			ele.y.textContent = '';
			ele.g.textContent = '';

			for (let i = 0; i < Math.round(value * mul); i++) {
				a[a.length - i] = true;
			}

			for (let i = 0; i < 20; i++) {
				if (i < 4) {
					ele.r.textContent += a[i] ? '□' : '•';
				} else if (i < 8) {
					ele.y.textContent += a[i] ? '□' : '•';
				} else {
					ele.g.textContent += a[i] ? '□' : '•';
				}
			}
		}
	}

	update() {
		if (this.data) {
			const vel = this.data.velocity();
			if (this.velocityX && this.velocityY) {
				this.calcShapes(Math.abs(vel.x), this.velocityX, 5);
				this.calcShapes(Math.abs(vel.y), this.velocityY, 12);
			}
		}
	}
}
