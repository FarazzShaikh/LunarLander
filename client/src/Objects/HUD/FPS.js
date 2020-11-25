import '../Components/Gauges.css';
import numeral from 'numeral';

export default class FPS {
	constructor(container, { data }) {
		const node = document.createElement('div');
		node.innerHTML = require('../Components/Gauges.html');
		container.appendChild(node);

		this.HTML = node;

		setTimeout(() => {
			this.data = data;

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
				l: document.querySelector('.Gague-container table tbody tr .text.velx'),
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
				l: document.querySelector('.Gague-container table tbody tr .text.vely'),
			};

			this.fuel = {
				r: document.querySelector(
					'.Gague-container table tbody tr .shape.fuel .red'
				),
				y: document.querySelector(
					'.Gague-container table tbody tr .shape.fuel .yellow'
				),
				g: document.querySelector(
					'.Gague-container table tbody tr .shape.fuel .white'
				),
				l: document.querySelector('.Gague-container table tbody tr .text.fuel'),
			};
			this.health = {
				r: document.querySelector(
					'.Gague-container table tbody tr .shape.health .red'
				),
				y: document.querySelector(
					'.Gague-container table tbody tr .shape.health .yellow'
				),
				g: document.querySelector(
					'.Gague-container table tbody tr .shape.health .white'
				),
				l: document.querySelector('.Gague-container table tbody tr .text.health'),
			};

			setInterval(() => {
				if (this.data) {
					const vel = this.data.velocity();
					const systems = this.data.systems();
					if (this.velocityX && this.velocityY) {
						this.calcShapes(Math.abs(vel.x), this.velocityX, 5);
						this.calcShapes(Math.abs(vel.y), this.velocityY, 12);
						this.calcShapes(systems.fuel, this.fuel, 0.22, true);
						this.calcShapes(systems.health, this.health, 0.22, true);
					}
				}
			}, 100);
		}, 3000);
	}

	calcShapes(value, ele, mul, rev) {
		const a = new Array(20).fill(false);

		if (ele.r && ele.y && ele.g && ele.l) {
			ele.r.textContent = '';
			ele.y.textContent = '';
			ele.g.textContent = '';
			ele.l.textContent = `${numeral(value).format('0,000.00')}`;

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

			if (rev) {
				let text = ele.r.textContent + ele.y.textContent + ele.g.textContent;
				text = reverse(text);
				ele.r.textContent = text.slice(0, 3);
				ele.y.textContent = text.slice(3, 7);
				ele.g.textContent = text.slice(7, 19);
			}
		}
	}

	update() {}
}

function reverse(s) {
	return s.split('').reverse().join('');
}
